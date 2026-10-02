import Brand from "@/components/layout/Brand";
import Survey from "./Survey";

/** Encuesta accesible sin login: `#/publica/encuesta` (o los enlaces antiguos `#encuesta`). */
export default function PublicSurveyPage() {
  return (
    <>
      <header>
        <Brand subtitle="Encuesta de valoración" />
      </header>
      <main>
        <Survey />
      </main>
    </>
  );
}
