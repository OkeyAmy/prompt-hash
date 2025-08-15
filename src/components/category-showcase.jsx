import { Button } from "./ui/button";
import Link from "next/link";

const categories = [
	{
		id: 1,
		name: "Image Generation",
		count: 1243,
		image: "/images/image-generator.png",
	},
	{
		id: 2,
		name: "Text & Writing",
		count: 876,
		image: "/images/text&writing.png",
	},
	{
		id: 3,
		name: "Code & Development",
		count: 542,
		image: "/images/code&dev.png",
	},
	{ id: 4, name: "Marketing", count: 321, image: "/images/marketing.png" },
];

export function CategoryShowcase() {
	return (
		<section className="py-16 px-6 bg-background">
			<div className="mx-auto max-w-7xl">
				<h2 className="text-2xl font-bold tracking-tight text-foreground mb-8">
					Explore the App Store
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{categories.map((category) => (
						<Link href={`/category/${category.id}`} key={category.id}>
							<div className="relative group overflow-hidden rounded-lg">
								<div className="aspect-[4/3] overflow-hidden">
									<img
										src={category.image || "/placeholder.svg"}
										alt={category.name}
										className="object-cover w-full h-full transition-transform group-hover:scale-105"
									/>
								</div>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
									<h3 className="text-lg font-semibold text-primary-foreground">
										{category.name}
									</h3>
									<p className="text-sm text-primary-foreground/80">
										{category.count} prompts
									</p>
								</div>
							</div>
						</Link>
					))}
				</div>
				<div className="mt-8 text-center">
					<Link href="/browse">
						<Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
							View All Categories
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
