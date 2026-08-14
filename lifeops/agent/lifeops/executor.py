from datetime import (
    datetime,
    timedelta,
)
from .models import (
    DocumentAnalysis,
    LifeOpsPlan,
)
from .guardian import (GuardianDecision)
from .tools.life_objects import (create_life_object)
from .tools.obligations import (create_obligation)
from .tools.runs import (record_agent_run)
from .tools.reminders import (schedule_reminder)

class LifeOpsExecutor:
    def execute(self, user_id: str, document: DocumentAnalysis, plan: LifeOpsPlan, guardian: GuardianDecision) -> dict:
        if not guardian.permitted:
            return {
                "executed": False,
                "reason": guardian.reason,
                "results": [],
            }

        results = []
        life_object_id = None
        obligation_id = None

        for action in plan.actions:

            # CREATE LIFE OBJECT
            if (action.type == "create_life_object"):
                result = (
                    create_life_object(
                        user_id=user_id,
                        object_type=document.documentType,
                        title=self._build_title(document),
                        source="universal-drop",
                        metadata=document.model_dump(),
                    )
                )

                life_object_id = (
                    result["objectId"]
                )

                results.append({
                    "action": action.type,
                    "result": result,
                })

            # CREATE OBLIGATION
            elif (action.type == "create_obligation"):
                if (not life_object_id):
                    continue
                if (not document.dueDate):
                    continue

                result = (
                    create_obligation(
                        user_id=user_id,
                        life_object_id=life_object_id,
                        title=self._build_obligation_title(document),
                        due_date=document.dueDate,
                        amount=document.total or 0,
                    )
                )

                obligation_id = (
                    result["obligationId"]
                )

                results.append({
                    "action": action.type,
                    "result": result,
                })

            # CREATE SCHEDULE REMINDER
            elif (action.type == "schedule_reminder"):
                if not obligation_id:
                    continue
                if not document.dueDate:
                    continue

                reminder_time = (self._reminder_time(document.dueDate))

                if not reminder_time:
                    continue

                result = schedule_reminder(
                    user_id=user_id,
                    obligation_id=obligation_id,
                    reminder_time=reminder_time,
                    message=plan.briefing,
                )

                results.append({
                    "action": action.type,
                    "result": result,
                })

        # RECORD AGENT RUN
        run = record_agent_run(
            user_id=user_id,
            trigger="document_uploaded",
            status="completed",
            summary=plan.briefing,
            actions=[
                result["action"] for result in results
            ],
        )

        return {
            "executed": True,
            "results": results,
            "run": run,
        }

    # --------------------------------
    # HELPERS
    # --------------------------------
    def _build_title(self, document: DocumentAnalysis) -> str:
        if document.vendor:
            return (
                f"{document.vendor} "
                f"{document.documentType}"
            )
        return (
            f"LifeOps "
            f"{document.documentType}"
        )

    def _build_obligation_title(self, document: DocumentAnalysis) -> str:
        if document.vendor:
            return (
                f"Handle "
                f"{document.vendor}"
            )

        return (
            "Handle upcoming "
            "obligation"
        )

    def _reminder_time(self, due_date: str) -> str | None:
        formats = [
            "%Y-%m-%d",
            "%d/%m/%Y",
            "%d-%m-%Y",
        ]

        parsed = None

        for fmt in formats:
            try:
                parsed = (
                    datetime.strptime(due_date, fmt)
                )
                break
            except ValueError:
                continue

        if not parsed:
            return None

        reminder = (parsed - timedelta(days=3))
        reminder = (
            reminder.replace(
                hour=9,
                minute=0,
                second=0,
            )
        )

        return reminder.strftime(
            "%Y-%m-%dT%H:%M:%S"
        )
            