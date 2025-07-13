import { ScrollPicker } from "./components/ScrollPicker";
import { TextArea } from "./components/TextArea";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 py-10 bg-background">
      <h1 className="text-3xl font-bold rounded-full bg-secondary text-secondary-foreground py-2 px-4 shadow">
        React Components
      </h1>

      <div className="w-full max-w-3xl px-4 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Scroll Picker</h2>
        <ScrollPicker />
      </div>

      <div className="w-full max-w-3xl px-4">
        <h2 className="text-2xl font-semibold mb-4">
          Text Area with Non-Latin Highlighting
        </h2>
        <TextArea />
      </div>
    </div>
  );
}

export default App;
