"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, Check, X } from "lucide-react"

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col bg-gradient-to-r from-purple-400 to-blue-500">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg text-gray-900">
            <h1 className="text-3xl font-bold mb-2">DAO Governance</h1>
            <p className="text-gray-600">
              Participate in governance decisions and help shape the future of the marketplace.
            </p>
          </div>

          <Tabs defaultValue="proposals">
            <TabsList className="grid w-full grid-cols-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
              <TabsTrigger value="proposals" className="text-gray-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600">Active Proposals</TabsTrigger>
              <TabsTrigger value="disputes" className="text-gray-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600">Dispute Resolution</TabsTrigger>
            </TabsList>

            <TabsContent value="proposals" className="mt-6">
              <div className="grid gap-6">
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-gray-200 text-gray-900">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Reduce Marketplace Fees</CardTitle>
                        <p className="text-sm text-gray-600 mt-2">
                          Proposal to reduce marketplace fees from 2.5% to 2%.
                        </p>
                      </div>
                      <Badge className="flex items-center gap-1 bg-blue-100 text-blue-700"> 
                        <Clock className="h-3 w-3" />2 days left
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Current Votes</span>
                        <span>75% Yes / 25% No</span>
                      </div>
                      <Progress value={75} />
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" variant="outline">
                          <Check className="mr-2 h-4 w-4" /> Vote Yes
                        </Button>
                        <Button className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-blue-50" variant="outline">
                          <X className="mr-2 h-4 w-4" /> Vote No
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="disputes" className="mt-6">
              <div className="grid gap-6">
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-gray-200 text-gray-900">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Dispute #123</CardTitle>
                        <p className="text-sm text-gray-600 mt-2">
                          Buyer claims the prompt quality doesn't match the description.
                        </p>
                      </div>
                      <Badge variant="destructive">Active Dispute</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Resolution Votes</span>
                        <span>60% Refund / 40% Deny</span>
                      </div>
                      <Progress value={60} />
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-blue-50" variant="outline">
                      Vote Refund
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" variant="outline">
                      Vote Deny
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}

