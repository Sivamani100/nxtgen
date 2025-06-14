
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ExamCutoffTableProps {
  examCutoffs: Record<string, Record<string, number>>;
  eligibleExams: string[];
}

const ExamCutoffTable = ({ examCutoffs, eligibleExams }: ExamCutoffTableProps) => {
  const examLabels: Record<string, string> = {
    'jee-main': 'JEE Main',
    'jee-advanced': 'JEE Advanced',
    'neet': 'NEET',
    'ap-eamcet': 'AP EAMCET (EAPCET)',
    'ts-eamcet': 'TS EAMCET'
  };

  const categoryLabels: Record<string, string> = {
    'general': 'General/OC',
    'obc': 'OBC',
    'sc': 'SC',
    'st': 'ST',
    'bc_a': 'BC-A',
    'bc_b': 'BC-B',
    'bc_c': 'BC-C',
    'bc_d': 'BC-D',
    'bc_e': 'BC-E'
  };

  return (
    <Card className="p-6 bg-white shadow-lg border-2 border-blue-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Exam-wise Cutoff Ranks</h3>
      
      {eligibleExams.length === 0 ? (
        <p className="text-gray-600">No exam cutoff data available.</p>
      ) : (
        <div className="space-y-6">
          {eligibleExams.map((exam) => {
            const cutoffs = examCutoffs[exam];
            if (!cutoffs) return null;

            return (
              <div key={exam} className="border rounded-lg p-4">
                <h4 className="text-lg font-bold text-blue-700 mb-3">
                  {examLabels[exam] || exam.toUpperCase()}
                </h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold text-gray-900">Category</TableHead>
                        <TableHead className="font-bold text-gray-900 text-right">Cutoff Rank</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(cutoffs).map(([category, rank]) => (
                        <TableRow key={category} className="hover:bg-blue-50">
                          <TableCell className="font-medium text-gray-800">
                            {categoryLabels[category] || category.toUpperCase()}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {rank.toLocaleString()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
        <p className="text-sm text-orange-800 font-medium">
          <strong>Note:</strong> These are previous year cutoff ranks and may vary this year based on various factors like exam difficulty, number of candidates, etc.
        </p>
      </div>
    </Card>
  );
};

export default ExamCutoffTable;
