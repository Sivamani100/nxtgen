
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CutoffRanksTableProps {
  college: {
    cutoff_rank_general?: number;
    cutoff_rank_obc?: number;
    cutoff_rank_sc?: number;
    cutoff_rank_st?: number;
    cutoff_rank_bc_a?: number;
    cutoff_rank_bc_b?: number;
    cutoff_rank_bc_c?: number;
    cutoff_rank_bc_d?: number;
    cutoff_rank_bc_e?: number;
  };
}

const CutoffRanksTable = ({ college }: CutoffRanksTableProps) => {
  const cutoffData = [
    { category: 'General/OC', rank: college.cutoff_rank_general },
    { category: 'OBC', rank: college.cutoff_rank_obc },
    { category: 'SC', rank: college.cutoff_rank_sc },
    { category: 'ST', rank: college.cutoff_rank_st },
    { category: 'BC-A', rank: college.cutoff_rank_bc_a },
    { category: 'BC-B', rank: college.cutoff_rank_bc_b },
    { category: 'BC-C', rank: college.cutoff_rank_bc_c },
    { category: 'BC-D', rank: college.cutoff_rank_bc_d },
    { category: 'BC-E', rank: college.cutoff_rank_bc_e },
  ];

  return (
    <Card className="p-6 bg-white shadow-lg border-2 border-blue-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Previous Year Cutoff Ranks</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-gray-900">Category</TableHead>
              <TableHead className="font-bold text-gray-900 text-right">Cutoff Rank</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cutoffData.map((item) => (
              <TableRow key={item.category} className="hover:bg-blue-50">
                <TableCell className="font-medium text-gray-800">{item.category}</TableCell>
                <TableCell className="text-right">
                  {item.rank ? (
                    <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {item.rank.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
        <p className="text-sm text-orange-800 font-medium">
          <strong>Note:</strong> These are previous year cutoff ranks and may vary this year based on various factors like exam difficulty, number of candidates, etc.
        </p>
      </div>
    </Card>
  );
};

export default CutoffRanksTable;
