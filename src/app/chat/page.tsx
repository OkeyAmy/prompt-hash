import { ChatInterface } from "@/components/chat-interface";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col bg-gray-950 text-foreground">
			<Navigation />
			<main className="flex-1">
				<ChatInterface />
			</main>
			<Footer />
		</div>
	);
}
