import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { auditors } from '@/data/auditors';
import { allProtocols, allLanguages, Protocol, Language } from '@/types/auditor';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Filter, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SortField = 'rank' | 'highFindings' | 'mediumFindings' | 'daysOfAuditing' | 'totalEarnings' | 'points';

const Leaderboard = () => {
  const [sortBy, setSortBy] = useState<SortField>('rank');
  const [protocolFilter, setProtocolFilter] = useState<Protocol | 'all'>('all');
  const [languageFilter, setLanguageFilter] = useState<Language | 'all'>('all');

  const filteredAuditors = auditors.filter((auditor) => {
    if (protocolFilter !== 'all' && !auditor.protocols.includes(protocolFilter)) {
      return false;
    }
    if (languageFilter !== 'all' && !auditor.languages.includes(languageFilter)) {
      return false;
    }
    return true;
  });

  const sortedAuditors = [...filteredAuditors].sort((a, b) => {
    switch (sortBy) {
      case 'highFindings':
        return b.highFindings - a.highFindings;
      case 'mediumFindings':
        return b.mediumFindings - a.mediumFindings;
      case 'daysOfAuditing':
        return b.daysOfAuditing - a.daysOfAuditing;
      case 'totalEarnings':
        return parseFloat(b.totalEarnings.replace(/[$,]/g, '')) - parseFloat(a.totalEarnings.replace(/[$,]/g, ''));
      case 'points':
        return b.points - a.points;
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

  const clearFilters = () => {
    setProtocolFilter('all');
    setLanguageFilter('all');
  };

  const hasActiveFilters = protocolFilter !== 'all' || languageFilter !== 'all';

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

        {/* Filters */}
        <div className="glass-card rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Select
                value={protocolFilter}
                onValueChange={(value) => setProtocolFilter(value as Protocol | 'all')}
              >
                <SelectTrigger className="w-[140px] bg-background/50 border-border/50">
                  <SelectValue placeholder="Protocol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Protocols</SelectItem>
                  {allProtocols.map((protocol) => (
                    <SelectItem key={protocol} value={protocol}>
                      {protocol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={languageFilter}
                onValueChange={(value) => setLanguageFilter(value as Language | 'all')}
              >
                <SelectTrigger className="w-[140px] bg-background/50 border-border/50">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {allLanguages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                  Clear
                </Button>
              )}
            </div>

            <div className="ml-auto text-sm text-muted-foreground">
              {sortedAuditors.length} auditor{sortedAuditors.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-20 text-center">Rank</TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead 
                  className="text-center cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => setSortBy('highFindings')}
                >
                  <span className={sortBy === 'highFindings' ? 'text-cyan' : ''}>High</span>
                </TableHead>
                <TableHead 
                  className="text-center cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => setSortBy('mediumFindings')}
                >
                  <span className={sortBy === 'mediumFindings' ? 'text-cyan' : ''}>Medium</span>
                </TableHead>
                <TableHead 
                  className="text-center cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => setSortBy('daysOfAuditing')}
                >
                  <span className={sortBy === 'daysOfAuditing' ? 'text-cyan' : ''}>Days</span>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => setSortBy('totalEarnings')}
                >
                  <span className={sortBy === 'totalEarnings' ? 'text-cyan' : ''}>Earnings</span>
                </TableHead>
                <TableHead 
                  className="text-center cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => setSortBy('points')}
                >
                  <span className={sortBy === 'points' ? 'text-cyan' : ''}>Pts</span>
                </TableHead>
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
                    <Link to={`/auditor/${auditor.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                      <img
                        src={auditor.avatar}
                        alt={auditor.username}
                        className="w-10 h-10 rounded-full bg-muted border border-border"
                      />
                      <div>
                        <p className="font-semibold text-foreground">{auditor.username}</p>
                        <div className="flex gap-1 mt-1">
                          {auditor.languages.slice(0, 2).map((lang) => (
                            <span key={lang} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
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
                  <TableCell className="text-center text-muted-foreground">
                    {auditor.daysOfAuditing}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-gradient font-semibold">{auditor.totalEarnings}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-cyan font-semibold">{auditor.points.toLocaleString()}</span>
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
