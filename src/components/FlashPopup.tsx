
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, ExternalLink, Share2 } from 'lucide-react';
import ShareButton from './ShareButton';
import { toast } from 'sonner';

interface FlashPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const importantResources = [
  {
    id: 1,
    title: 'Top Engineering colleges list',
    description: 'We have select the top colleges for you',
    link: 'https://example.com/admission-guide.pdf',
    type: 'PDF',
  },
 
  {
    id: 2,
    title: 'Check out the notification',
    description: 'Eapcet council has released important updates',
    link: 'https://cets.apsche.ap.gov.in/EAPCET/Eapcet/EAPCET_HomePage.aspxs',
    type: 'Link',
  },
];

const FlashPopup: React.FC<FlashPopupProps> = ({ isOpen, onClose }) => {
  const handleOpenLink = (url: string, title: string, id: number) => {
    // Open the original link
    window.open(url, '_blank');
    
    // Show success message for sharing
    toast.success(`${title} opened! Share link has been generated.`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] bg-white rounded-2xl p-6 shadow-xl border border-blue-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-900">
            📢 Important Updates
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-md font-semibold text-blue-800 flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-blue-600" />
              Resources for You
            </h3>
            <div className="grid gap-4">
              {importantResources.map((resource, index) => (
                <Card
                  key={index}
                  className="p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="self-start text-xs text-blue-800 border-blue-400"
                      >
                        {resource.type}
                      </Badge>
                      <ShareButton
                        itemId={resource.id}
                        itemType="resource"
                        title={resource.title}
                        className="ml-2"
                      />
                    </div>
                    <h4 className="font-medium text-sm text-blue-900">
                      {resource.title}
                    </h4>
                    <p className="text-sm text-blue-700">
                      {resource.description}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenLink(resource.link, resource.title, resource.id)}
                      className="mt-2 text-sm border-green-400 text-green-700 hover:bg-green-100 flex items-center gap-1"
                    >
                      {resource.type === 'PDF' ? (
                        <FileText className="w-4 h-4 text-green-500" />
                      ) : (
                        <ExternalLink className="w-4 h-4 text-green-500" />
                      )}
                      Open {resource.type}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={onClose}
              className="bg-blue-800 hover:bg-blue-700 text-white text-sm py-2 rounded-lg font-semibold"
            >
              ✅ Continue to App
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white text-blue-800 border border-blue-300 hover:bg-blue-50 text-sm py-2 rounded-lg font-medium"
            >
              🔁 Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlashPopup;
