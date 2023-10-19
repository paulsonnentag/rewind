import * as A from "@automerge/automerge"
import { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument, useHandle, useRepo } from "@automerge/automerge-repo-react-hooks";
import { useEffect, useState } from "react";

function App({ docUrl }: { docUrl: AutomergeUrl }) {
  const handle = useHandle<unknown>(docUrl); // used to trigger re-rendering when the doc loads

  const repo = useRepo()
  const [undoCount, setUndoCount] = useState(0)
  const [changes, setChanges]= useState([])

  const selectedHash = undoCount === 0 ? null : A.decodeChange(changes[changes.length - undoCount]).hash


  const [doc, setDoc] = useState(null)

  useEffect(() => {
    if (!selectedHash) {
      handle.whenReady().then(() => {
        setDoc(handle.docSync())
      })
      return
    }

    handle.whenReady().then(() => {
      setDoc(A.view(handle.docSync(), [selectedHash]))
    })

  }, [selectedHash])

  useEffect(() => {
    console.log("foo")

    handle.whenReady().then(() => {
      console.log("load")

      setChanges(A.getAllChanges(handle.docSync()))
    })
  }, [handle])


  const onUndo = () => {
    setUndoCount( (undoCount) => {
      return undoCount < changes.length ? undoCount + 1 : undoCount
    })
  }

  const onRedo = () => {
    setUndoCount( (undoCount) => undoCount > 0 ? undoCount - 1 : undoCount)
  }

  const onClone = () => {
    let newHandle = repo.create()
    newHandle.update(() => A.clone(A.view(handle.docSync(), selectedHash ? [selectedHash] : [])))


    console.log(newHandle.url)

    //location.hash = newHandle.url
  }

  return (
    <div>
      {undoCount}
      <button onClick={() => onUndo()} disabled={undoCount === changes.length}>undo</button>
      <button onClick={() => onRedo()} disabled={undoCount === 0}>redo</button>


      <button onClick={() => onClone()}>new doc from current state</button>

      <pre>{JSON.stringify(doc?.content, null, 2)}</pre>
    </div>
  )
}

export default App;
