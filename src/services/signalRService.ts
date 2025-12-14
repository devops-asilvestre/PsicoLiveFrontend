import * as signalR from "@microsoft/signalr";

const SIGNALR_URL = "https://localhost:2359";

export function createSignalingConnection(roomId: string) {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${SIGNALR_URL}/signalr`)
    .withAutomaticReconnect()
    .build();

  connection.start().then(() => {
    connection.invoke("JoinRoom", roomId);
  });

  return connection;
}

export function createInsightsConnection(sessionId: string, onInsightUpdate: (payload: any) => void) {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${SIGNALR_URL}/insightsHub`)
    .withAutomaticReconnect()
    .build();

  connection.start().then(() => {
    connection.invoke("JoinSession", sessionId);
  });

  connection.on("InsightUpdate", onInsightUpdate);

  return connection;
}
