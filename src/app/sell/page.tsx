"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePromptForm } from "./CreatePromptForm";
import { PromptListings } from "./PromptListings";

export default function SellPage() {
  return (
    <div className="min-h-screen flex flex-col bg-deepblue-900 text-deepblue-50">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="new">
            <TabsList className="grid w-full grid-cols-2 bg-deepblue-800">
              <TabsTrigger value="new">New Prompt</TabsTrigger>
              <TabsTrigger value="listings">My Prompts</TabsTrigger>
            </TabsList>

            <TabsContent value="new" className="mt-6">
              <Card className="bg-white/70 dark:bg-deepblue-800/60 backdrop-blur border-deepblue-700">
                <CardHeader>
                  <CardTitle>Create a New Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                  <CreatePromptForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="listings" className="mt-6">
              <PromptListings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
