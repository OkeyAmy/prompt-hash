import { ChatInterface } from "@/components/chat-interface";
import { Navigation } from "@/components/navigation";

export default function Home() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<Navigation />
			<ChatInterface />
		</div>
	);
}
