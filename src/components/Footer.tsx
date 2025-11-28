import { Github, Twitter, MessageCircle } from "lucide-react";
import logo from "@/assets/dualguard-logo.png";

const Footer = () => {
  const footerLinks = {
    Platform: [
      { name: "Contests", href: "#contests" },
      { name: "Leaderboard", href: "#leaderboard" },
      { name: "Submit Protocol", href: "#submit" },
      { name: "Become Auditor", href: "#auditor" },
    ],
    Resources: [
      { name: "Documentation", href: "#docs" },
      { name: "Blog", href: "#blog" },
      { name: "Research", href: "#research" },
      { name: "API", href: "#api" },
    ],
    Company: [
      { name: "About", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Contact", href: "#contact" },
      { name: "Brand Kit", href: "#brand" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: MessageCircle, href: "https://discord.com", label: "Discord" },
  ];

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer */}
        <div className="grid gap-12 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2">
              <img src={logo} alt="Dualguard" className="h-10 w-10" />
              <span className="font-display text-xl font-bold text-gradient">Dualguard</span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The leading smart contract security platform. Competitive audits, elite researchers, 
              and comprehensive security for the decentralized world.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-all duration-300 hover:border-cyan/50 hover:text-cyan"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-foreground">{category}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Dualguard. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Securing the future of Web3, one audit at a time.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
