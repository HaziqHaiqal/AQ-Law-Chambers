import type { emergencySteps } from "@/data/site";
import { Reveal } from "@/components/Motion/Reveal";

type EmergencyStepsProps = {
  steps: readonly (typeof emergencySteps)[number][];
};

export function EmergencySteps({ steps }: EmergencyStepsProps) {
  return (
    <ol className="border-t border-white/20 lg:mt-2">
      {steps.map((step, index) => (
        <Reveal
          as="li"
          key={step.title}
          delay={index * 70}
          className="grid grid-cols-[3rem_1fr] border-b border-white/15 py-7"
        >
          <span className="pt-0.5 font-serif text-xl text-gold italic">
            0{index + 1}
          </span>
          <div>
            <h3 className="text-lg font-medium">{step.title}</h3>
            <p className="mt-2 text-[15px] leading-[1.75] text-slate-light">
              {step.body}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
