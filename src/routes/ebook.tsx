import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, ShoppingCart, QrCode, X, Download, Sparkles } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import bookCover from "@/assets/kisan-lens-book-cover.jpg";
import bookQr from "@/assets/kisan-lens-book-qr.png";

export const Route = createFileRoute("/ebook")({
  component: EbookPage,
  head: () => ({
    meta: [
      { title: "ई-बुक — Kisan Lens: A Farmer's Son's Dream | किसान मित्र" },
      {
        name: "description",
        content:
          "Kisan Lens: A Farmer's Son's Dream — एक किसान के बेटे की कहानी, जिसने AI और मेहनत से भारतीय किसानों की ज़िंदगी बदलने का सपना देखा। Google Play Books पर पढ़ें।",
      },
      { property: "og:title", content: "ई-बुक — Kisan Lens: A Farmer's Son's Dream" },
      {
        property: "og:description",
        content:
          "एक किसान के बेटे की प्रेरणादायक यात्रा। AI, कृषि और सपनों की किताब अब Google Play Books पर।",
      },
      { property: "og:type", content: "book" },
      { property: "og:url", content: "https://kisanlens.com/ebook" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/ebook" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Book",
          name: "Kisan Lens: A Farmer's Son's Dream",
          author: { "@type": "Person", name: "Abhinav Saini" },
          url: "https://kisanlens.com/ebook",
          offers: {
            "@type": "Offer",
            url: "https://play.google.com/store/books/details/Abhinav_Saini_Kisan_Lens_A_Farmer_s_Son_s_Dream?id=qCr_EQAAQBAJ",
            availability: "https://schema.org/InStock",
          },
        }),
      },
    ],
  }),
});

const PLAY_BOOKS_URL =
  "https://play.google.com/store/books/details/Abhinav_Saini_Kisan_Lens_A_Farmer_s_Son_s_Dream?id=qCr_EQAAQBAJ";

function EbookPage() {
  const [sampleOpen, setSampleOpen] = useState(false);

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-gradient-hero py-10 md:py-16">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 md:flex-row md:items-start md:gap-12">
          {/* Book Cover */}
          <div className="w-full max-w-xs shrink-0 md:max-w-sm">
            <div className="group relative mx-auto w-fit">
              <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 opacity-60 blur-2xl transition-opacity group-hover:opacity-80" />
              <img
                src={bookCover}
                alt="Kisan Lens: A Farmer's Son's Dream book cover"
                width={1024}
                height={1024}
                loading="eager"
                className="relative z-10 w-full max-w-[320px] rounded-2xl shadow-strong transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> नई ई-बुक
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
              Kisan Lens:
              <br />
              <span className="text-primary">A Farmer's Son's Dream</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              एक किसान के बेटे की असली कहानी — जिसने अपने खेत, अपने गाँव और अपने देश के किसानों के लिए
              AI तकनीक को ज़मीन से जोड़ने का सपना देखा। यह किताब हर उस युवा के लिए प्रेरणा है जो कृषि और
              टेक्नोलॉजी से भारत बदलना चाहता है।
            </p>

            <ul className="mt-6 inline-flex flex-col gap-2 text-left text-sm text-muted-foreground md:text-base">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>फसल रोग पहचान से लेकर AI-आधारित कृषि सलाह तक का सफ़र</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>किसानों की ज़िंदगी बदलने वाली सच्ची घटनाएँ और सीख</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>Google Play Books पर उपलब्ध — कहीं भी, कभी भी पढ़ें</span>
              </li>
            </ul>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
              <Button
                size="lg"
                className="h-12 w-full rounded-xl bg-gradient-primary px-6 text-base font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] sm:w-auto"
                onClick={() => setSampleOpen(true)}
              >
                <BookOpen className="mr-2 h-5 w-5" /> Read Sample
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-xl border-primary/30 px-6 text-base font-semibold text-primary hover:bg-primary/5 sm:w-auto"
                asChild
              >
                <a href={PLAY_BOOKS_URL} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Buy on Google Play Books
                </a>
              </Button>
            </div>

            {/* QR Code */}
            <div className="mt-10 flex flex-col items-center rounded-2xl border border-border bg-card p-5 shadow-soft md:mt-8 md:w-fit md:items-start">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <QrCode className="h-4 w-4 text-primary" />
                <span>QR कोड से खोलें</span>
              </div>
              <img
                src={bookQr}
                alt="QR code to open Kisan Lens book on Google Play Books"
                width={250}
                height={250}
                loading="lazy"
                className="h-40 w-40 rounded-xl border border-border bg-white p-2"
              />
              <p className="mt-3 max-w-[200px] text-center text-xs text-muted-foreground md:text-left">
                इस QR कोड को स्कैन करें और सीधे Google Play Books पर जाएँ।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Modal */}
      {sampleOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.currentTarget === e.target) setSampleOpen(false);
          }}
        >
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-6 shadow-strong md:p-8">
            <button
              onClick={() => setSampleOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="बंद करें"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-foreground md:text-2xl">पढ़ें — अध्याय १: एक बेटे का सपना</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
              <span className="font-semibold text-foreground">पहली बारिश</span>
              <br />
              <br />
              जब मैं छोटा था, मेरे पिता हर सुबह अंधेरे में उठकर खेत की तरफ चले जाते थे। उनके हाथ में एक
              कुदाल होती थी और कंधे पर एक गमछा। मैं खिड़की से उन्हें जाते देखता और सोचता — काश मैं भी बड़ा
              होकर उनके साथ जा सकता।
              <br />
              <br />
              वो दिन अब दूर हैं, लेकिन उनकी मेहनत आज भी मेरी आँखों के सामने है। मेरे पिता एक किसान थे, और
              मैं एक किसान का बेटा। यह किताब उनकी मेहनत, उनके सपनों और उस यात्रा की कहानी है जिसने Kisan Lens
              को जन्म दिया।
              <br />
              <br />
              मैंने देखा है कि कैसे एक फसल बीमारी पूरे परिवार की आमदनी छीन लेती है। मैंने देखा है कि कैसे
              गलत दवा का इस्तेमाल ज़मीन को भी बीमार कर देता है। और मैंने यह भी देखा है कि कैसे सही जानकारी,
              सही समय पर, एक किसान की ज़िंदगी बदल सकती है।
              <br />
              <br />
              Kisan Lens सिर्फ़ एक ऐप नहीं है। यह मेरे पिता की मेहनत का सम्मान है, मेरे गाँव की मिट्टी से
              निकला एक वादा है, और हर किसान के लिए एक उम्मीद की किरन।
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 flex-1 rounded-xl bg-gradient-primary text-base font-bold text-primary-foreground"
                asChild
              >
                <a href={PLAY_BOOKS_URL} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="mr-2 h-5 w-5" /> अभी खरीदें
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 flex-1 rounded-xl text-base font-semibold"
                onClick={() => setSampleOpen(false)}
              >
                <Download className="mr-2 h-5 w-5" /> बंद करें
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
