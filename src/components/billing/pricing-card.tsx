"use client";

import { useFormStatus } from "react-dom";
import { Check, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PricingCardProps = {
  action?: (formData: FormData) => void | Promise<void>;
  cta: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  name: string;
  planId: string;
  price: string;
};

export function PricingCard({
  action,
  cta,
  description,
  features,
  highlighted,
  name,
  planId,
  price,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "flex min-h-[560px] flex-col rounded-lg border bg-card p-6 transition duration-200 hover:border-white/25",
        highlighted &&
          "border-white/30 bg-white text-black shadow-[0_18px_60px_rgba(255,255,255,0.12)]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-normal">{name}</h2>
          <p
            className={cn(
              "mt-2 text-sm leading-6 text-muted-foreground",
              highlighted && "text-black/60",
            )}
          >
            {description}
          </p>
        </div>
        {highlighted ? (
          <Badge className="bg-black text-white">Most Popular</Badge>
        ) : null}
      </div>
      <div className="mt-8">
        <p className="text-5xl font-semibold tracking-normal">{price}</p>
      </div>
      <ul className="mt-8 flex flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li
            key={feature}
            className={cn(
              "flex gap-3 text-sm text-muted-foreground",
              highlighted && "text-black/70",
            )}
          >
            <Check
              className={cn(
                "mt-0.5 size-4 shrink-0 text-foreground",
                highlighted && "text-black",
              )}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {action ? (
        <form action={action} className="mt-8">
          <input type="hidden" name="plan" value={planId} />
          <PricingSubmitButton highlighted={highlighted} label={cta} />
        </form>
      ) : (
        <Button className="mt-8 w-full" variant={highlighted ? "default" : "outline"}>
          {cta}
        </Button>
      )}
    </div>
  );
}

function PricingSubmitButton({
  highlighted,
  label,
}: {
  highlighted?: boolean;
  label: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending || label === "Current Plan"}
      variant={highlighted ? "default" : "outline"}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {pending ? "Opening checkout..." : label}
    </Button>
  );
}
