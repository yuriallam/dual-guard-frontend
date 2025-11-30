import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { auditors } from '@/data/auditors';
import { Button } from '@/components/ui/button';
import { Trophy, Bug, DollarSign, Target, Medal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type SortField = 'rank' | 'highFindings' | 'totalEarnings' | 'winRate';

const Leaderboard = () => {
  const [sortBy, setSortBy] = useState<SortField>('rank');

  const sortedAuditors = [...auditors].sort((a, b) => {
    switch (sortBy) {
      case 'highFindings':
        return b.highFindings - a.highFindings;
      case 'totalEarnings':
        return parseFloat(b.totalEarnings.replace(/[$,]/g, '')) - parseFloat(a.totalEarnings.replace(/[$,]/g, ''));
      case 'winRate':
        return b.winRate - a.winRate;
      default:
        return a.rank - b.rank;
    }
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-muted-foreground font-mono">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Top security researchers ranked by their contributions to the Dualguard ecosystem
          </p>
        </div>

        {/* Sort Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            variant={sortBy === 'rank' ? 'gradient' : 'outline'}
            size="sm"
            onClick={() => setSortBy('rank')}
            className="gap-2"
          >
            <Trophy className="w-4 h-4" />
            Overall Rank
          </Button>
          <Button
            variant={sortBy === 'highFindings' ? 'gradient' : 'outline'}
            size="sm"
            onClick={() => setSortBy('highFindings')}
            className="gap-2"
          >
            <Bug className="w-4 h-4" />
            High Findings
          </Button>
          <Button
            variant={sortBy === 'totalEarnings' ? 'gradient' : 'outline'}
            size="sm"
            onClick={() => setSortBy('totalEarnings')}
            className="gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Total Earnings
          </Button>
          <Button
            variant={sortBy === 'winRate' ? 'gradient' : 'outline'}
            size="sm"
            onClick={() => setSortBy('winRate')}
            className="gap-2"
          >
            <Target className="w-4 h-4" />
            Win Rate
          </Button>
        </div>

        {/* Leaderboard Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-20 text-center">Rank</TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead className="text-center">High</TableHead>
                <TableHead className="text-center">Medium</TableHead>
                <TableHead className="text-center">Low</TableHead>
                <TableHead className="text-center">Contests</TableHead>
                <TableHead className="text-center">Win Rate</TableHead>
                <TableHead className="text-right">Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAuditors.map((auditor, index) => (
                <TableRow 
                  key={auditor.id} 
                  className="border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {getRankBadge(index + 1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={auditor.avatar}
                        alt={auditor.username}
                        className="w-10 h-10 rounded-full bg-muted border border-border"
                      />
                      <div>
                        <p className="font-semibold text-foreground">{auditor.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {auditor.highFindings + auditor.mediumFindings + auditor.lowFindings} total findings
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-10 h-6 rounded bg-red-500/10 text-red-400 text-sm font-medium">
                      {auditor.highFindings}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-10 h-6 rounded bg-yellow-500/10 text-yellow-400 text-sm font-medium">
                      {auditor.mediumFindings}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-10 h-6 rounded bg-blue-500/10 text-blue-400 text-sm font-medium">
                      {auditor.lowFindings}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {auditor.contestsParticipated}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-cyan font-medium">{auditor.winRate}%</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-gradient font-semibold">{auditor.totalEarnings}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
