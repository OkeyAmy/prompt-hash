import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingSection() {
	return (
		<section className="py-16 bg-deepblue-900">
			<div className="container">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">
						Simple, Transparent Pricing
					</h2>
					<p className="text-deepblue-300 max-w-2xl mx-auto">
						Choose the plan that works best for you, whether you're just getting
						started or a power user.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8 max-w-5xl text-deepblue-200 mx-auto">
					{[
						{
							name: "Free",
							price: "0",
							description: "Perfect for exploring and getting started",
							features: [
								"Access to free prompts",
								"Basic prompt generation",
								"Community support",
								"Limited API access",
							],
							cta: "Get Started",
							popular: false,
						},
						{
							name: "Pro",
							price: "19",
							description: "For serious creators and professionals",
							features: [
								"Everything in Free",
								"Unlimited prompt generation",
								"Priority support",
								"Full API access",
								"Advanced analytics",
								"Custom prompt templates",
							],
							cta: "Upgrade to Pro",
							popular: true,
						},
						{
							name: "Enterprise",
							price: "99",
							description: "For teams and organizations",
							features: [
								"Everything in Pro",
								"Team collaboration",
								"Custom integrations",
								"Dedicated account manager",
								"SLA guarantees",
								"Custom branding",
							],
							cta: "Contact Sales",
							popular: false,
						},
					].map((plan, index) => (
						<div
							key={index}
							className={`rounded-lg border ${
								plan.popular
									? "border-primary bg-deepblue-800/40"
									: "border-deepblue-700 bg-deepblue-900"
							} p-8 relative`}
						>
							{plan.popular && (
								<div className="absolute top-0 right-0 bg-primary text-white text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">
									Most Popular
								</div>
							)}

							<h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
							<div className="flex items-baseline mb-4">
								<span className="text-3xl font-bold text-white">${plan.price}</span>
								<span className="text-deepblue-300 ml-1">/month</span>
							</div>
							<p className="text-deepblue-300 text-sm mb-6">{plan.description}</p>

							<ul className="space-y-3 mb-8">
								{plan.features.map((feature, i) => (
									<li key={i} className="flex items-start gap-2">
										<Check className="size-5 text-green-500 shrink-0 mt-0.5" />
										<span className="text-sm">{feature}</span>
									</li>
								))}
							</ul>

							<Button
								className={
									plan.popular
										? "w-full bg-primary hover:bg-deepblue-700"
										: "w-full"
								}
								variant={plan.popular ? "default" : "outline"}
							>
								{plan.cta}
							</Button>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
