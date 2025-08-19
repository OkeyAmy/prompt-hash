"use client";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarIcon, Wallet, History, Settings } from "lucide-react";
import { Footer } from "@/components/footer";

export default function ProfilePage() {
	return (
		<div className="min-h-screen bg-gray-950 text-white flex flex-col bg-gradient-to-r from-purple-400 to-blue-500">
			<Navigation />
			<main className="flex-1 container py-8">
				<div className="max-w-4xl mx-auto">
					<div className="flex items-start gap-6 mb-8 bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
						<Avatar className="h-24 w-24">
							<AvatarImage src="/images/alex.Atom.png" />
							<AvatarFallback className="bg-blue-100 text-blue-600 text-xl">JD</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<h1 className="text-3xl font-bold text-gray-900">John.atom</h1>
							<p className="text-gray-600">Joined December 2023</p>
							<div className="flex items-center gap-2 mt-2">
								<StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
								<span className="text-gray-900">4.9 Rating</span>
								<span className="text-gray-600">• 50 Reviews</span>
							</div>
						</div>
						<Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">Edit Profile</Button>
					</div>

					<Tabs defaultValue="activity">
						<TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
							<TabsTrigger value="activity" className="text-gray-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600">Activity</TabsTrigger>
							<TabsTrigger value="wallet" className="text-gray-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600">Wallet</TabsTrigger>
							<TabsTrigger value="settings" className="text-gray-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600">Settings</TabsTrigger>
						</TabsList>

						<TabsContent value="activity" className="mt-6">
							<div className="grid gap-6">
								<Card className="bg-white/90 backdrop-blur-sm shadow-lg border-gray-200">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-gray-900">
											<History className="h-5 w-5 text-blue-600" />
											Recent Activity
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{/* Activity Items */}
											<div className="flex justify-between items-center py-2 border-b border-gray-200">
												<div>
													<p className="font-medium text-gray-900">
														Purchased "SEO Content Optimizer"
													</p>
													<p className="text-sm text-gray-600">
														2 days ago
													</p>
												</div>
												<Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">0.08 Atom</Badge>
											</div>
											<div className="flex justify-between items-center py-2 border-b border-gray-200">
												<div>
													<p className="font-medium text-gray-900">
														Sold "Creative Story Generator"
													</p>
													<p className="text-sm text-gray-600">
														5 days ago
													</p>
												</div>
												<Badge className="bg-green-100 text-green-700 hover:bg-green-200">0.1 Atom</Badge>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="wallet" className="mt-6">
							<Card className="bg-white/90 backdrop-blur-sm shadow-lg border-gray-200">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-gray-900">
										<Wallet className="h-5 w-5 text-blue-600" />
										Wallet Details
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-6">
										<div>
											<p className="text-sm text-gray-600">
												Connected Wallet
											</p>
											<p className="font-mono text-gray-900">cosmos...x0dq</p>
										</div>
										<div>
											<p className="text-sm text-gray-600">Balance</p>
											<p className="text-2xl font-bold text-gray-900">2.5 Atom</p>
										</div>
										<Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">Withdraw Funds</Button>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="settings" className="mt-6">
							<Card className="bg-white/90 backdrop-blur-sm shadow-lg border-gray-200">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-gray-900">
										<Settings className="h-5 w-5 text-blue-600" />
										Account Settings
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<label className="text-sm font-medium text-gray-900">
												Display Name
											</label>
											<input
												type="text"
												title="Display Name"
												placeholder="Enter Display Name"
												className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												defaultValue="John.atom"
											/>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-900">
												Email Notifications
											</label>
											<div className="mt-2 space-y-2">
												<label className="flex items-center gap-2 text-gray-700">
													<input type="checkbox" defaultChecked className="text-blue-600 focus:ring-blue-500" />
													<span>New prompt purchases</span>
												</label>
												<label className="flex items-center gap-2 text-gray-700">
													<input type="checkbox" defaultChecked className="text-blue-600 focus:ring-blue-500" />
													<span>New reviews</span>
												</label>
											</div>
										</div>
										<Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">Save Changes</Button>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</main>
			<Footer />
		</div>
	);
}
