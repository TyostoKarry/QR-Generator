import { useContext } from "react";
import { QRGeneratorArea } from "./components/QRGeneratorArea";
import { Topbar } from "./components/Topbar";
import { LanguageContext } from "./contexts/LanguageContext";

function App() {
  const lang = useContext(LanguageContext);
  return (
    <>
      <Topbar />
      <main className="flex flex-col items-center h-[calc(100dvh-4rem)] gap-8 px-4 pt-24">
        <section className="text-center w-2/3">
          <p className="text-2xl font-medium wrap text-text text-shadow-sm ">
            {lang.general.introText}
          </p>
        </section>
        <QRGeneratorArea />
      </main>
    </>
  );
}

export default App;
