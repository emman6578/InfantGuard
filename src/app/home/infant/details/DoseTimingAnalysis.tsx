import React from "react";

interface VaccineName {
  id: string;
  vaccine_name: string;
  vaccine_type_code: string;
  // add other fields if needed
}

interface VaccineSchedule {
  id: string;
  firstDose?: string;
  secondDose?: string;
  thirdDose?: string;
  UpdateFirstDose?: string;
  UpdateSecondDose?: string;
  UpdateThirdDose?: string;
  vaccine_names?: VaccineName[];
  // add other fields if needed
}

interface InfantData {
  id: string;
  fullname: string;
  Vaccination_Schedule: VaccineSchedule[];
  // add other fields if needed
}

interface DoseTimingAnalysisProps {
  infantData: InfantData;
}

const DoseTimingAnalysis: React.FC<DoseTimingAnalysisProps> = ({
  infantData,
}) => {
  if (!infantData || !infantData.Vaccination_Schedule) {
    return <div>No vaccination data available for analysis.</div>;
  }

  const schedules = infantData.Vaccination_Schedule;

  let totalDoses = 0;
  let earlyCount = 0;
  let onTimeCount = 0;
  let lateCount = 0;
  const detailedResults: {
    vaccine: string;
    dose: string;
    scheduled: string;
    updated: string;
    difference: number;
    status: string;
  }[] = [];

  // Helper function to compute the day difference between scheduled and updated dates
  const dayDifference = (scheduled: string, updated: string): number => {
    const scheduledDate = new Date(scheduled);
    const updatedDate = new Date(updated);
    const diffTime = updatedDate.getTime() - scheduledDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return Math.round(diffDays);
  };

  schedules.forEach((schedule) => {
    const vaccineName =
      schedule.vaccine_names && schedule.vaccine_names.length > 0
        ? schedule.vaccine_names[0].vaccine_name
        : "Unknown Vaccine";

    // Analyze First Dose if scheduled
    if (schedule.firstDose) {
      totalDoses++;
      if (schedule.UpdateFirstDose) {
        const diff = dayDifference(
          schedule.firstDose,
          schedule.UpdateFirstDose
        );
        let status = "";
        if (diff === 0) {
          status = "ON TIME";
          onTimeCount++;
        } else if (diff < 0) {
          status = `EARLY by ${Math.abs(diff)} day${
            Math.abs(diff) > 1 ? "s" : ""
          }`;
          earlyCount++;
        } else {
          status = `LATE by ${diff} day${diff > 1 ? "s" : ""}`;
          lateCount++;
        }
        detailedResults.push({
          vaccine: vaccineName,
          dose: "First Dose",
          scheduled: schedule.firstDose,
          updated: schedule.UpdateFirstDose,
          difference: diff,
          status,
        });
      }
    }

    // Analyze Second Dose if scheduled
    if (schedule.secondDose) {
      totalDoses++;
      if (schedule.UpdateSecondDose) {
        const diff = dayDifference(
          schedule.secondDose,
          schedule.UpdateSecondDose
        );
        let status = "";
        if (diff === 0) {
          status = "ON TIME";
          onTimeCount++;
        } else if (diff < 0) {
          status = `EARLY by ${Math.abs(diff)} day${
            Math.abs(diff) > 1 ? "s" : ""
          }`;
          earlyCount++;
        } else {
          status = `LATE by ${diff} day${diff > 1 ? "s" : ""}`;
          lateCount++;
        }
        detailedResults.push({
          vaccine: vaccineName,
          dose: "Second Dose",
          scheduled: schedule.secondDose,
          updated: schedule.UpdateSecondDose,
          difference: diff,
          status,
        });
      }
    }

    // Analyze Third Dose if scheduled
    if (schedule.thirdDose) {
      totalDoses++;
      if (schedule.UpdateThirdDose) {
        const diff = dayDifference(
          schedule.thirdDose,
          schedule.UpdateThirdDose
        );
        let status = "";
        if (diff === 0) {
          status = "ON TIME";
          onTimeCount++;
        } else if (diff < 0) {
          status = `EARLY by ${Math.abs(diff)} day${
            Math.abs(diff) > 1 ? "s" : ""
          }`;
          earlyCount++;
        } else {
          status = `LATE by ${diff} day${diff > 1 ? "s" : ""}`;
          lateCount++;
        }
        detailedResults.push({
          vaccine: vaccineName,
          dose: "Third Dose",
          scheduled: schedule.thirdDose,
          updated: schedule.UpdateThirdDose,
          difference: diff,
          status,
        });
      }
    }
  });

  // Calculate overall percentages
  const overallEarly =
    totalDoses > 0 ? ((earlyCount / totalDoses) * 100).toFixed(1) : "0";
  const overallOnTime =
    totalDoses > 0 ? ((onTimeCount / totalDoses) * 100).toFixed(1) : "0";
  const overallLate =
    totalDoses > 0 ? ((lateCount / totalDoses) * 100).toFixed(1) : "0";

  // Prepare a set of unique vaccines for which we can display potential effects
  const uniqueVaccines = new Set<string>();
  schedules.forEach((schedule) => {
    if (schedule.vaccine_names && schedule.vaccine_names[0]?.vaccine_name) {
      uniqueVaccines.add(schedule.vaccine_names[0].vaccine_name);
    }
  });
  const uniqueVaccineArray = Array.from(uniqueVaccines);

  // Mapping of vaccine names to potential effects if administered too early or too late.
  const vaccineEffects: {
    [key: string]: {
      early: string;
      late: string;
    };
  } = {
    "BGC Vaccine": {
      early:
        "Administering this vaccine too early may result in a suboptimal immune response as the infant's immune system might not be fully prepared, though slight deviations may be acceptable.",
      late: "If administered late, the infant may remain vulnerable to the targeted infection for a longer period.",
    },
    "Hepatatis B Vaccine": {
      early:
        "Administering the Hepatitis B vaccine too early might lead to interference from maternal antibodies, potentially reducing its effectiveness.",
      late: "A delay in administering the Hepatitis B vaccine could increase the risk of vertical transmission from mother to child.",
    },
    "Oral Polio Vaccine": {
      early:
        "Early administration might not allow for optimal mucosal immunity if the infant's gut is not ready, and maternal antibodies may interfere with the response.",
      late: "Late administration could leave the infant unprotected for a longer period, increasing the risk of poliovirus exposure.",
    },
    "Penatavalent Vaccine": {
      early:
        "If given too early, there may be reduced immunogenicity, and the infant might not mount a strong immune response.",
      late: "Delayed administration could lead to a window of vulnerability to the diseases targeted by this vaccine.",
    },
    "Measels,Mumps,Rubella Vaccine": {
      early:
        "Administering the MMR vaccine too early may result in interference from maternal antibodies, thereby reducing its effectiveness.",
      late: "Late vaccination might result in a prolonged period of susceptibility to measles, mumps, and rubella, which is especially concerning during outbreaks.",
    },
    "Pneumococcal Conjugate Vaccine": {
      early:
        "Administering the vaccine too early might lead to a less effective immune response due to the immaturity of the infant's immune system.",
      late: "Delays in vaccination may leave the child at increased risk for pneumococcal infections, which can be serious in young infants.",
    },
    "Inactivated Polio Vaccine": {
      early:
        "Early vaccination could potentially reduce the vaccine's efficacy if the infant's immune system hasn't matured enough, though it is generally safe.",
      late: "Delayed doses may result in prolonged vulnerability to poliovirus infection.",
    },
  };

  // Function to fetch effects for a given vaccine name
  const getEffects = (vaccine: string) => {
    return (
      vaccineEffects[vaccine] || {
        early: "No specific data available for early administration.",
        late: "No specific data available for delayed administration.",
      }
    );
  };

  return (
    <div className="p-4 border rounded shadow bg-white my-4">
      <h2 className="text-2xl font-bold mb-4">
        Vaccination Dose Timing Analysis
      </h2>

      <div className="mb-4">
        <p>
          <strong>Total Doses Analyzed:</strong> {totalDoses}
        </p>
        <p>
          <strong>Early Doses:</strong> {earlyCount} ({overallEarly}%)
        </p>
        <p>
          <strong>On Time Doses:</strong> {onTimeCount} ({overallOnTime}%)
        </p>
        <p>
          <strong>Late Doses:</strong> {lateCount} ({overallLate}%)
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">
          Detailed Analysis per Dose:
        </h3>
        <ul>
          {detailedResults.map((result, index) => (
            <li key={index} className="mb-1">
              <span className="font-semibold">
                {result.vaccine} - {result.dose}:
              </span>{" "}
              Scheduled on {new Date(result.scheduled).toLocaleDateString()},
              updated on {new Date(result.updated).toLocaleDateString()} (
              {result.status})
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t pt-4 mb-4">
        <h3 className="text-xl font-semibold mb-2">Predictive Analysis:</h3>
        <p>
          Based on current trends, a significant percentage of doses have been
          administered early. This proactive approach may shorten the window of
          vulnerability; however, if a vaccine is administered too early, the
          infant’s immune system may not generate an optimal response.
          Conversely, late vaccination increases the period during which the
          child is unprotected. Monitoring these patterns can help ensure that
          future doses are timed for maximum efficacy.
        </p>
      </div>

      <div className="border-t pt-4 mb-4">
        <h3 className="text-xl font-semibold mb-2">
          Potential Effects of Early or Late Vaccination:
        </h3>
        {uniqueVaccineArray.map((vaccine, index) => {
          const effects = getEffects(vaccine);
          return (
            <div key={index} className="mb-3">
              <h4 className="font-bold">{vaccine}</h4>
              <p>
                <strong>If administered too early:</strong> {effects.early}
              </p>
              <p>
                <strong>If administered too late:</strong> {effects.late}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">References:</h3>
        <ol className="list-decimal ml-5">
          <li>
            Centers for Disease Control and Prevention.{" "}
            <em>Timing and Spacing of Immunobiologics</em>.{" "}
            <a
              href="https://www.cdc.gov/vaccines/hcp/imz-best-practices/timing-spacing-immunobiologics.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://www.cdc.gov/vaccines/hcp/imz-best-practices/timing-spacing-immunobiologics.html
            </a>
          </li>
          <li>
            Clark, A., Sanderson, C.{" "}
            <em>
              Timing of children's vaccinations in 45 low-income and
              middle-income countries: an analysis of survey data
            </em>
            . The Lancet.{" "}
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/2526419/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://pubmed.ncbi.nlm.nih.gov/2526419/
            </a>
          </li>
          <li>
            Centers for Disease Control and Prevention.{" "}
            <em>
              General Best Practice Guidelines for Immunization: Timing and
              Spacing of Immunobiologics
            </em>
            .{" "}
            <a
              href="https://www.cdc.gov/vaccines/hcp/acip-recs/general-recs/timing.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://www.cdc.gov/vaccines/hcp/acip-recs/general-recs/timing.html
            </a>
          </li>
          <li>
            World Health Organization. <em>Poliomyelitis</em>.{" "}
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/poliomyelitis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://www.who.int/news-room/fact-sheets/detail/poliomyelitis
            </a>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default DoseTimingAnalysis;
