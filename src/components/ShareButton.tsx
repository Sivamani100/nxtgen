
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ShareButtonProps {
  itemId: number;
  itemType: 'news' | 'college' | 'resource';
  title: string;
  className?: string;
}

const ShareButton = ({ itemId, itemType, title, className = "" }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/shared/${itemType}/${itemId}`;
    return shareUrl;
  };

  const handleCopyLink = async () => {
    const shareLink = generateShareLink();
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    const shareLink = generateShareLink();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this ${itemType}: ${title}`,
          url: shareLink,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to copying link
      handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`p-2 hover:bg-blue-50 ${className}`}
          title="Share this item"
        >
          <Share2 className="w-4 h-4 text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Share "{title}"
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Share Link
            </label>
            <div className="flex space-x-2">
              <Input
                value={generateShareLink()}
                readOnly
                className="flex-1 text-sm bg-gray-50"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="px-3"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleShare}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Now
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;
