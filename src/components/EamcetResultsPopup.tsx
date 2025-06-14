
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Trophy, Calendar, ArrowLeft } from "lucide-react";

interface EamcetResultsPopupProps {
  open: boolean;
  onClose: () => void;
}

const EamcetResultsPopup = ({ open, onClose }: EamcetResultsPopupProps) => {
  const [showWebview, setShowWebview] = useState(false);

  const handleOpenWebview = () => {
    setShowWebview(true);
  };

  const handleBackToPopup = () => {
    setShowWebview(false);
  };

  const handleCloseAll = () => {
    setShowWebview(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseAll}>
      <DialogContent className={`${showWebview ? 'max-w-5xl h-[90vh]' : 'max-w-md'} mx-auto bg-gradient-to-br from-blue-50 to-green-50 border-2 border-green-200`}>
        {!showWebview ? (
          <>
            <DialogHeader className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-8 h-8 text-yellow-600 mr-2" />
                <DialogTitle className="text-xl font-bold text-green-700">
                  AP EAPCET Results 2025!
                </DialogTitle>
              </div>
            </DialogHeader>
            
            <Card className="p-6 bg-white border-2 border-green-300 shadow-lg">
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    🎉 Check Your AP EAPCET Engineering Results 2025!
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    AP EAPCET Engineering results are now available. Click below to check your results and explore your college options.
                  </p>
                  <div className="flex items-center justify-center text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    <Calendar className="w-3 h-3 mr-1" />
                    Results just announced!
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button
                    onClick={handleOpenWebview}
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold text-base shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Check AP EAPCET Results
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full h-10 border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Maybe Later
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  Stay updated with the latest results
                </p>
              </div>
            </Card>
          </>
        ) : (
          <>
            <DialogHeader className="flex flex-row items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:bg-blue-50"
                onClick={handleBackToPopup}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <DialogTitle className="text-lg font-bold text-green-700">
                AP EAPCET Results 2025
              </DialogTitle>
              <div className="w-16"></div>
            </DialogHeader>
            
            <div className="flex-1 bg-white rounded-lg border-2 border-green-200 overflow-hidden">
              <iframe
                src="https://results.eenadu.net/ap-eapcet-2025/ap-eapcet-engineering-results-2025.aspx"
                className="w-full h-full"
                title="AP EAPCET Engineering Results 2025"
                style={{ minHeight: '70vh' }}
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EamcetResultsPopup;
