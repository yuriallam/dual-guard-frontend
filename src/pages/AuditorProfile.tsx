import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { auditors } from '@/data/auditors';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Target, Zap, TrendingUp } from 'lucide-react';

const AuditorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const auditor = auditors.find((a) => a.id === id);

  if (!auditor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Auditor not found</h1>
          <Link to="/leaderboard">
            <Button variant="outline">Back to Leaderboard</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Earnings',
      value: auditor.totalEarnings,
      icon: Trophy,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
    },
    {
      label: 'Win Rate',
      value: `${auditor.winRate}%`,
      icon: Target,
      color: 'text-cyan',
      bgColor: 'bg-cyan/10',
    },
    {
      label: 'Conversion Rate',
      value: `${auditor.conversionRate}%`,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      label: 'Accuracy Rate',
      value: `${auditor.accuracyRate}%`,
      icon: Zap,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
  ];

  const findings = [
    {
      severity: 'High',
      total: auditor.highFindings,
      solo: auditor.soloHighFindings,
      color: 'bg-red-500/10 text-red-400 border-red-500/20',
    },
    {
      severity: 'Medium',
      total: auditor.mediumFindings,
      solo: auditor.soloMediumFindings,
      color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    },
    {
      severity: 'Low',
      total: auditor.lowFindings,
      solo: auditor.soloLowFindings,
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        {/* Back Button */}
        <Link to="/leaderboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Leaderboard
        </Link>

        {/* Profile Header */}
        <div className="glass-card rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={auditor.avatar}
              alt={auditor.username}
              className="w-24 h-24 rounded-full bg-muted border-2 border-border"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{auditor.username}</h1>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan/20 to-purple/20 text-sm font-medium">
                  Rank #{auditor.rank}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {auditor.protocols.map((protocol) => (
                  <span key={protocol} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                    {protocol}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {auditor.languages.map((lang) => (
                  <span key={lang} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Total Points</p>
              <p className="text-3xl font-bold text-gradient">{auditor.points.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-2">{auditor.daysOfAuditing} days auditing</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-6">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Findings Breakdown */}
        <div className="glass-card rounded-xl p-8">
          <h2 className="text-xl font-bold mb-6">Findings Breakdown</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {findings.map((finding) => (
              <div key={finding.severity} className={`rounded-xl p-6 border ${finding.color}`}>
                <h3 className="text-lg font-semibold mb-4">{finding.severity} Severity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-2xl font-bold">{finding.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Solo</span>
                    <span className="text-xl font-semibold">{finding.solo}</span>
                  </div>
                  <div className="h-px bg-border/50 my-2" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Solo Rate</span>
                    <span className="font-medium">{Math.round((finding.solo / finding.total) * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuditorProfile;
