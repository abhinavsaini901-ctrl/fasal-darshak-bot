import { Link } from "@tanstack/react-router";
import { Leaf, Mail, Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { AdSlot } from "./AdSlot";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      {/* Ad Slot #3 — Footer area */}
      <AdSlot variant="footer" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <p className="text-base font-bold">किसान मित्र</p>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              भारतीय किसानों के लिए AI-आधारित कृषि सहायक — फसल स्कैन, रोग पहचान, मंडी भाव और सरकारी
              योजनाओं की जानकारी एक ही जगह।
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="YouTube" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground">श्रेणियां</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/crop-diseases" className="hover:text-primary">फसल रोग</Link></li>
              <li><Link to="/pest-control" className="hover:text-primary">कीट नियंत्रण</Link></li>
              <li><Link to="/market-prices" className="hover:text-primary">मंडी भाव</Link></li>
              <li><Link to="/government-schemes" className="hover:text-primary">सरकारी योजनाएं</Link></li>
              <li><Link to="/blog" className="hover:text-primary">सभी लेख</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground">कंपनी</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">हमारे बारे में</Link></li>
              <li><Link to="/contact" className="hover:text-primary">संपर्क करें</Link></li>
              <li><Link to="/scanner" className="hover:text-primary">AI फसल डॉक्टर</Link></li>
              <li><a href="/sitemap.xml" className="hover:text-primary">साइटमैप</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground">कानूनी</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-primary">गोपनीयता नीति</Link></li>
              <li><Link to="/terms" className="hover:text-primary">नियम और शर्तें</Link></li>
              <li><Link to="/disclaimer" className="hover:text-primary">अस्वीकरण</Link></li>
            </ul>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <a href="mailto:support@kisanlens.com" className="hover:text-primary">
                support@kisanlens.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>© {year} किसान मित्र — सर्वाधिकार सुरक्षित। भारतीय किसानों के लिए बना, ❤️ के साथ।</p>
          <p className="mt-1">किसान मित्र भारतीय किसानों के लिए विश्वसनीय कृषि जानकारी, मंडी भाव, मौसम अपडेट और सरकारी योजनाओं की समग्र जानकारी प्रदान करता है। किसी भी कृषि निर्णय से पहले स्थानीय कृषि विशेषज्ञ या कृषि विज्ञान केंद्र (KVK) से परामर्श अवश्य लें।</p>
        </div>
      </div>
    </footer>
  );
}
