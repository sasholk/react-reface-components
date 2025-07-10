import { ScrollPicker } from "./components/ScrollPicker";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-3xl p-6 h-full bg-card shadow-lg">
        <ScrollPicker />
      </div>
    </div>
  );
}

export default App;
