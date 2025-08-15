import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useWriteContract } from "wagmi";
import { contractAddress, ABI } from "@/web3/PromptHash";

interface Prompt {
  _id: string;
  title: string;
  content: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  owner: {
    username: string;
    walletAddress: string;
  };
  promptTokenId: number;
  createdAt: string;
}

export function PromptListings() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sellingPromptId, setSellingPromptId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { address } = useAccount();
  const {
    data: hash,
    isPending: isContractPending,
    writeContract,
    error: contractError,
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    fetchUserPrompts();
  }, []);

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && sellingPromptId) {
      alert(`Prompt ${sellingPromptId} successfully listed for sale!`);
      setSellingPromptId(null);
      setIsSubmitting(false);
      // Optionally refresh the prompts list
      fetchUserPrompts();
    }
  }, [isConfirmed, sellingPromptId]);

  // Handle transaction errors
  useEffect(() => {
    if (contractError || confirmError) {
      console.error("Transaction error:", contractError || confirmError);
      alert(`Transaction failed: ${(contractError || confirmError)?.message}`);
      setIsSubmitting(false);
      setSellingPromptId(null);
    }
  }, [contractError, confirmError]);

  const fetchUserPrompts = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      if (!address) {
        throw new Error("Please connect your wallet first");
      }

      // Fetch prompts for the connected wallet
      const response = await fetch(`/api/prompts?walletAddress=${address}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch prompts");
      }

      setPrompts(data);
    } catch (error: any) {
      console.error("Error fetching prompts:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const listPromptForSale = async (prompt: Prompt) => {
    if (!address) {
      alert("Please connect your wallet before proceeding");
      return;
    }

    if (!prompt.promptTokenId) {
      alert("Invalid prompt token ID");
      return;
    }

    setIsSubmitting(true);
    setSellingPromptId(prompt.promptTokenId);

    try {
      // Convert price to wei (assuming price is in AVAX)
      const priceInWei = ethers.parseEther(prompt.price.toString());

      // List the prompt for sale based on the prompt id
      writeContract({
        address: contractAddress,
        abi: ABI,
        functionName: "listPromptForSale",
        args: [prompt.promptTokenId, priceInWei],
      });
    } catch (error: any) {
      console.error("Error listing prompt:", error);
      alert(`Failed to initiate transaction: ${error.message}`);
      setIsSubmitting(false);
      setSellingPromptId(null);
    }
  };

  const getButtonText = (promptTokenId: number) => {
    if (sellingPromptId === promptTokenId) {
      if (isContractPending) return "Confirming...";
      if (isConfirming) return "Processing...";
    }
    return "Sell";
  };

  const isButtonDisabled = (promptTokenId: number) => {
    return isSubmitting && sellingPromptId === promptTokenId;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-deepblue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center p-8 text-deepblue-200">
        No prompts found. Start by creating a new prompt!
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {prompts.map((prompt) => (
        <Card key={prompt._id} className="border-deepblue-700 bg-white/70 dark:bg-deepblue-800/60 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/4">
                <img
                  src={prompt.image}
                  alt={prompt.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-deepblue-900 dark:text-white">{prompt.title}</h3>
                  <div className="flex gap-2">
                    <Badge className="bg-primary text-white">
                      Rating: {prompt.rating}/5
                    </Badge>
                    <Badge className="bg-deepblue-700 text-white">
                      Token ID: {prompt.promptTokenId || 0}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-deepblue-700 dark:text-deepblue-100 mt-2 mb-4">
                  {prompt.content}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-deepblue-500">Category: </span>
                    <span className="font-medium">{prompt.category}</span>
                  </div>
                  <div>
                    <span className="text-deepblue-500">Price: </span>
                    <span className="font-medium">{prompt.price} AVAX</span>
                  </div>
                  <div>
                    <span className="text-deepblue-500">Created: </span>
                    <span className="font-medium">
                      {new Date(prompt.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Transaction Status */}
                {sellingPromptId === prompt.promptTokenId && (
                  <div className="mt-4 p-3 bg-deepblue-50 border border-deepblue-200 rounded-lg">
                    <p className="text-sm text-deepblue-800">
                      {isContractPending && "Waiting for wallet confirmation..."}
                      {isConfirming && "Confirming transaction on blockchain..."}
                    </p>
                    {hash && (
                      <p className="text-xs text-deepblue-700 mt-1">
                        Transaction Hash: {hash}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex md:flex-col gap-2 self-end md:self-center">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => listPromptForSale(prompt)}
                  disabled={isButtonDisabled(prompt.promptTokenId)}
                >
                  {isButtonDisabled(prompt.promptTokenId) && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {getButtonText(prompt.promptTokenId)}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}