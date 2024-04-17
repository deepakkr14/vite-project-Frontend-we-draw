// import { createShapes, tldraw } from 'tldraw';
// export const tldrawInit = async () => {
//   // Define the shapes you want to make available in your Tldraw library
//   const shapes = createShapes({
//     rectangle: {
//       name: 'Rectangle',
//       attributes: {
//         size: { width: 100, height: 50 },
//         fill: '#fff',
//         stroke: '#000',
//         strokeWidth: 2,
//       },
//     },
//     // Define more shapes here
//   })

//   // Wait for Tldraw to be ready
//   await tldraw.ready;
//   // await tldraw.isReady();

//   // Register the shapes with Tldraw
//   shapes.forEach((shape) => tldraw.registerShape(shape));

// };

import { useLayoutEffect, useState } from 'react'
import { Tldraw, createTLStore, defaultShapeUtils } from 'tldraw'
import 'tldraw/tldraw.css'

const PERSISTENCE_KEY = 'example-3'
const API_URL = '/api/tldraw'

export default function PersistenceExample() {
  // [1]
  const [store] = useState(() => createTLStore({ shapeUtils: defaultShapeUtils }))
  // [2]
  const [loadingState, setLoadingState] = useState({ status: 'loading' })

  useLayoutEffect(() => {
    setLoadingState({ status: 'loading' })

    // Get persisted data from server
    fetch(API_URL)
      .then((response) => response.json())
      .then((snapshot) => {
        store.loadSnapshot(snapshot)
        setLoadingState({ status: 'ready' })
      })
      .catch((error) => {
        setLoadingState({ status: 'error', error: error.message }) // Something went wrong
      })

    // Each time the store changes, send the snapshot to the server
    const cleanupFn = store.listen((snapshot) => {
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snapshot),
      })
    })

    return () => {
      cleanupFn()
    }
  }, [store])

  // [3]
  if (loadingState.status === 'loading') {
    return (
      <div className="tldraw__editor">
        <h2>Loading...</h2>
      </div>
    )
  }

  if (loadingState.status === 'error') {
    return (
      <div className="tldraw__editor">
        <h2>Error!</h2>
        <p>{loadingState.error}</p>
      </div>
    )
  }

  return (
    <div className="tldraw__editor">
      <Tldraw store={store} />
    </div>
  )
}