import useRouterElements from "./routes/useRouterElements"

function App() {
// nơi chứa cấc router
const rouerElement = useRouterElements();

  return (
    <>
    {rouerElement}
    </>
  )
}

export default App
