import { ChatInterface } from "@/components/chat-interface";
import { Navigation } from "@/components/navigation";

export default function Home() {
	return (
		<div className="min-h-screen bg-deepblue-900 text-deepblue-50 flex flex-col">
			<Navigation />
			<ChatInterface />
		</div>
	);
}
