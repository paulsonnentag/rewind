import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { Repo } from "@automerge/automerge-repo";
import { BroadcastChannelNetworkAdapter } from "@automerge/automerge-repo-network-broadcastchannel";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";

import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import App from "./App";

const repo = new Repo({
  network: [
    new BroadcastChannelNetworkAdapter(),
    new BrowserWebSocketClientAdapter("wss://sync.automerge.org"),
  ],
  storage: new IndexedDBStorageAdapter(),
});

const root = ReactDOM.createRoot(document.getElementById("root")!)


window.addEventListener("hashchange", function () {
 loadDoc(location.hash.slice(1))
});

loadDoc(location.hash.slice(1))

function loadDoc(docUrl) {

  console.log("load")

  root.render(
    <RepoContext.Provider value={repo}>
      <App docUrl={docUrl} />
    </RepoContext.Provider>
  )
}