export type AutonomyMode =
  | "auto"
  | "ask"
  | "observe";


export interface AutonomySettings {
  everydayAdmin:
    AutonomyMode;

  money:
    AutonomyMode;

  appointments:
    AutonomyMode;

  subscriptions:
    AutonomyMode;

  documents:
    AutonomyMode;

  warranties:
    AutonomyMode;

  renewals:
    AutonomyMode;
}


export async function getAutonomy():
  Promise<AutonomySettings> {

  const response =
    await fetch(
      "/api/autonomy",
      {
        cache:
          "no-store",
      },
    );

  if (!response.ok) {
    throw new Error(
      "Unable to load autonomy settings."
    );
  }

  const data =
    await response.json();

  return data.settings;
}


export async function saveAutonomy(
  settings:
    AutonomySettings,
):
  Promise<AutonomySettings> {

  const response =
    await fetch(
      "/api/autonomy",
      {
        method:
          "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            settings
          ),
      },
    );

  if (!response.ok) {
    throw new Error(
      "Unable to save autonomy settings."
    );
  }

  const data =
    await response.json();

  return data.settings;
}