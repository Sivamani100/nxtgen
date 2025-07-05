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
import { X, FileText, ExternalLink } from 'lucide-react';

interface FlashPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const importantResources = [
  {
    title: 'Engineering Admission Guide 2024',
    description: 'Complete guide for engineering admissions',
    link: 'https://example.com/admission-guide.pdf',
    type: 'PDF',
  },
  {
    title: 'Scholarship Opportunities',
    description: 'Latest scholarship information for students',
    link: 'https://example.com/scholarships',
    type: 'Link',
  },
];

const FlashPopup: React.FC<FlashPopupProps> = ({ isOpen, onClose }) => {
  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] bg-white rounded-2xl p-6 shadow-xl border border-blue-100">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-xl font-bold text-blue-900">
              📢 Important Updates
            </DialogTitle>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-blue-700 hover:text-red-500" />
            </button>
          </div>
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
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="text-xs text-blue-800 border-blue-400"
                      >
                        {resource.type}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm text-blue-900">
                      {resource.title}
                    </h4>
                    <p className="text-sm text-blue-700">{resource.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenLink(resource.link)}
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
