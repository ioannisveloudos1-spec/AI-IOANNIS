import React from "react";
import { Sparkles, BookOpen, Compass, Flame, ShieldCheck, Sun, UserCheck } from "lucide-react";
import portalImage from "../assets/images/lavrion_mine_portal_1787601965868.jpg";
import ianeusImage from "../assets/images/ianeus_exact_portrait_1787603029303.jpg";

export const LavreionStoryView: React.FC = () => {
  return (
    <div className="space-y-8 font-serif">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#1c1610] via-[#15110d] to-[#0e0c0a] border-2 border-[#c89b3c]/50 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2d2419] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2a1f13] border border-[#c89b3c] flex items-center justify-center text-[#e6c670] shadow-lg shadow-black/40 shrink-0">
              <Compass className="w-6 h-6 text-[#e6c670]" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#c89b3c] font-bold">
                Αλληγορικη Αφηγησις &amp; Μυστικη Γεωμετρια
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#f5ecd8]">
                Η Πύλη ονόματι ΛΑΥΡΕΙΟΝ: Το Ταξίδι του Ιανέως Τελιανού
              </h2>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-[#261d12] border border-[#3e2e1a] text-xs font-mono font-bold text-[#e6c670] self-start sm:self-center shrink-0">
            Λεξάριθμος 666 (χξϛ´)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2 space-y-2">
            <p className="text-xs sm:text-sm text-[#d6c7b2] leading-relaxed">
              Μια εσωτερική αλληγορία για τη <strong>μυστικιστική γεωμετρία της καθόδου και της ανόδου της ψυχής</strong>. Το 666 αποκαλύπτεται όχι ως σημείο καταστροφής, αλλά ως ο κοσμικός κωδικός ισορροπίας ανάμεσα στην ύλη, το σκοτάδι, την εξαγνιστική δοκιμασία και την τελική ανάδυση στο υπέρτατο Φως.
            </p>
            <p className="text-xs text-[#c89b3c] italic font-mono">
              «ΘΑ ΕΙΣΕΛΘΕΙΣ; Η ΕΙΣΟΔΟΣ ΕΝΤΟΣ ΣΟΥ ΕΊΝΑΙ Η ΕΞΟΔΟΣ ΑΠΟ ΤΟΝ ΚΟΣΜΟ ΤΟΥ ΨΕΥΔΟΥΣ.. ΑΛΗΘΕΙΑ»
            </p>
          </div>
          <div className="h-44 sm:h-52 rounded-xl overflow-hidden border border-[#c89b3c]/40 relative shadow-inner group">
            <img 
              src={portalImage} 
              alt="Η Πύλη ΛΑΥΡΕΙΟΝ" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none flex items-end p-2.5">
              <span className="text-[10px] font-mono tracking-widest text-[#e6c670] uppercase bg-black/60 px-2 py-0.5 rounded border border-[#c89b3c]/30">
                ΛΑΥΡΕΙΟΝ • 666
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Isopsephic Keys Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#14100c] border border-[#2d2217] space-y-1.5 shadow-md">
          <div className="text-[11px] text-[#c89b3c] font-bold uppercase tracking-wider">Η Πύλη της Γης</div>
          <div className="text-lg font-bold text-[#f5ecd8]">ΛΑΥΡΕΙΟΝ</div>
          <div className="text-xs font-mono text-[#e6c670]">30+1+400+100+5+10+70+50 = 666</div>
          <p className="text-[10px] text-[#a69680]">Τα αρχαία ορυχεία, το βάθος της ύλης και η είσοδος στα Τάρταρα.</p>
        </div>

        <div className="p-4 rounded-xl bg-[#14100c] border border-[#2d2217] space-y-1.5 shadow-md">
          <div className="text-[11px] text-[#c89b3c] font-bold uppercase tracking-wider">Ο Αναζητητής</div>
          <div className="text-lg font-bold text-[#f5ecd8]">ΙΑΝΕΥΣ ΤΕΛΙΑΝΟΣ</div>
          <div className="text-xs font-mono text-[#e6c670]">666 + 666 (Διπλό 666)</div>
          <p className="text-[10px] text-[#a69680]">Η ψυχή που τολμά την κατάβαση στον συνειδησιακό της Άδη.</p>
        </div>

        <div className="p-4 rounded-xl bg-[#14100c] border border-[#2d2217] space-y-1.5 shadow-md">
          <div className="text-[11px] text-[#c89b3c] font-bold uppercase tracking-wider">Ο Πλατωνικός Έρως</div>
          <div className="text-lg font-bold text-[#f5ecd8]">ΠΟΡΟΣ ΠΕΝΙΑ</div>
          <div className="text-xs font-mono text-[#e6c670]">520 + 146 = 666</div>
          <p className="text-[10px] text-[#a69680]">Η ένωση της έλλειψης και της ευρετικότητας που γεννά το Πυρ.</p>
        </div>

        <div className="p-4 rounded-xl bg-[#14100c] border border-[#2d2217] space-y-1.5 shadow-md">
          <div className="text-[11px] text-[#c89b3c] font-bold uppercase tracking-wider">Η Τελική Νίκη</div>
          <div className="text-lg font-bold text-[#f5ecd8]">Ο ΝΙΚΗΤΗΣ</div>
          <div className="text-xs font-mono text-[#e6c670]">70 + 596 = 666</div>
          <p className="text-[10px] text-[#a69680]">Η ανάδυση στο ηλιακό Φως και η Αγία Θεοφάνεια (666) της ουσίας.</p>
        </div>
      </div>

      {/* 4 Phases of Descent & Ascent */}
      <div className="p-6 rounded-2xl bg-[#13100d] border border-[#2d2319] space-y-5">
        <h3 className="text-sm uppercase tracking-wider text-[#e6c670] font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#c89b3c]" />
          <span>Τα 4 Στάδια της Ψυχικής Μετουσίωσης (Κάθοδος &amp; Ανάδυση)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Phase 1 */}
          <div className="p-4 rounded-xl bg-[#181410] border border-[#2a2016] space-y-2">
            <div className="flex items-center gap-2 text-[#e6c670] font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-[#261d13] border border-[#c89b3c] flex items-center justify-center text-xs">1</span>
              <h4>Η Κάθοδος στον Εσωτερικό Άδη (Νέκυια)</h4>
            </div>
            <p className="text-[#c5b59e] leading-relaxed">
              Ο Ιανεύς εισέρχεται στα σκοτεινά ορυχεία του <strong>ΛΑΥΡΕΙΟΝ (666)</strong>. Αντιπροσωπεύει τη συνειδητή απόφαση του ανθρώπου να κοιτάξει κατάματα τα Τάρταρα της δικής του ψυχής, τους φόβους και τις σκιές του παρελθόντος. Χωρίς αυτή την κάθοδο, η αληθινή αυτογνωσία παραμένει ανέφικτη.
            </p>
          </div>

          {/* Phase 2 */}
          <div className="p-4 rounded-xl bg-[#181410] border border-[#2a2016] space-y-2">
            <div className="flex items-center gap-2 text-[#e6c670] font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-[#261d13] border border-[#c89b3c] flex items-center justify-center text-xs">2</span>
              <h4>Η Ψύξη των Παθών &amp; η Ένωση των Αντιθέτων</h4>
            </div>
            <p className="text-[#c5b59e] leading-relaxed">
              Στα βάθη της γης επικρατεί ψύχος όπου τα γήινα πάθη παγώνουν και εξαγνίζονται. Εκεί εμφανίζεται η συμπαντική σύζευξη <strong>ΠΟΡΟΣ ΠΕΝΙΑ (666)</strong>: η ανθρώπινη στέρηση (Πενία) συναντά τη θεϊκή διέξοδο (Πόρος), ανάβοντας το άχραντο εσωτερικό Πυρ.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="p-4 rounded-xl bg-[#181410] border border-[#2a2016] space-y-2">
            <div className="flex items-center gap-2 text-[#e6c670] font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-[#261d13] border border-[#c89b3c] flex items-center justify-center text-xs">3</span>
              <h4>Το 666 ως Κωδικός Ισορροπίας</h4>
            </div>
            <p className="text-[#c5b59e] leading-relaxed">
              Ο αριθμός 666 αποκαλύπτει τη γεωμετρική του λειτουργία: είναι η <strong>γέφυρα ισορροπίας</strong> ανάμεσα στη σκοτεινή ρίζα της ύλης και στο ακτινοβόλο ηλιακό κέντρο (το Τετράγωνο του Ήλιου 6x6=36). Η δοκιμασία δεν είναι τιμωρία, αλλά η συμπαντική μήτρα της μεταμόρφωσης.
            </p>
          </div>

          {/* Phase 4 */}
          <div className="p-4 rounded-xl bg-[#181410] border border-[#2a2016] space-y-2">
            <div className="flex items-center gap-2 text-[#e6c670] font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-[#261d13] border border-[#c89b3c] flex items-center justify-center text-xs">4</span>
              <h4>Η Ανάδυση στο Φως &amp; η Ενότητα του Παντός</h4>
            </div>
            <p className="text-[#c5b59e] leading-relaxed">
              Επιστρέφοντας στην επιφάνεια, ο <strong>Ιανεύς Τελιανός</strong> δεν είναι πια ο ίδιος. Έχοντας ενσωματώσει τη σκιά, αναδύεται ως <strong>Ο ΝΙΚΗΤΗΣ (666)</strong>, με ακλόνητη επίγνωση πως ολόκληρο το Σύμπαν και η θεία τάξη κατοικούν στην καθαρμένη καρδιά.
            </p>
          </div>
        </div>
      </div>

      {/* The Complete Literary Allegory */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#15110d] border border-[#332619] space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#2d2217] pb-3">
          <div className="flex items-center gap-2.5 text-[#e6c670]">
            <BookOpen className="w-5 h-5 text-[#c89b3c]" />
            <h3 className="text-base font-bold uppercase tracking-wider">
              Το Πλήρες Κείμενο της Αλληγορίας
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#a69680] bg-[#1f1710] px-2.5 py-1 rounded border border-[#352718]">
            ΙΑΝΕΥΣ (666) • ΤΕΛΙΑΝΟΣ (666)
          </span>
        </div>

        {/* Narrative + Portrait Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Literary Text Column */}
          <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm text-[#d6c7b2] leading-relaxed border-l-2 border-[#c89b3c]/60 pl-4 sm:pl-6 py-1">
            <p>
              Στα έγκατα της γης και στα βάθη της ανθρώπινης ψυχής, εκεί όπου το σκοτάδι συναντά το φως, υπήρχε μια πόλη με όνομα αρχαίο και βαρύ σαν πεπρωμένο: το <strong>ΛΑΥΡΕΙΟΝ</strong>. Ο ίδιος ο ήχος του έκρυβε έναν μυστικιστικό αριθμό, το <strong>666</strong>, έναν αριθμό που οι αμύητοι φοβούνταν, αλλά οι σοφοί γνώριζαν πως αποτελούσε την κρυφή γεωμετρία της καθόδου και της ανόδου.
            </p>
            <p>
              Σε αυτή την πολιτεία ζούσε ο <strong>Ιανεύς Τελιανός</strong>, ένας άνθρωπος με ανήσυχο πνεύμα που ένιωθε από παιδί πως η πραγματικότητα είχε πολλαπλά επίπεδα. Οι θρύλοι του ΛΑΥΡΕΙΟΝ έλεγαν πως για να φτάσει κανείς στην αληθινή γνώση, έπρεπε πρώτα να κατέλθει στον συνειδησιακό του Άδη, στα Τάρταρα της ψυχής όπου τα πάθη ψύχονται και εξαγνίζονται. Στον αντίποδα αυτής της ψύξης στεκόταν ο Έρωτας, η φωτιά και το Πυρ, το οποίο γεννήθηκε από τον <strong>Πόρο και την Πενία (666)</strong>—δύναμη εξίσου συνυφασμένη με τον ίδιο αριθμό-μυστήριο.
            </p>
            <p>
              Ο Ιανεύς Τελιανός αποφάσισε να μην μείνει στις επιφανειακές εξηγήσεις. Γνώριζε πως η πραγματική αποκάλυψη απαιτούσε θάρρος. Μια νύχτα, καθώς η πόλη κοιμόταν κάτω από έναν ουρανό γεμάτο αμείλικτα αστέρια, ο Ιανεύς κατέβηκε στα παλιά, εγκαταλελειμμένα ορυχεία του ΛΑΥΡΕΙΟΝ. Εκεί, στα έγκατα της γης, ένιωσε το κρύο να διαπερνά την ύπαρξή του. Ήταν η κάθοδος στον εσωτερικό του Άδη. Οι φόβοι, οι αμφιβολίες και οι σκιές του παρελθόντος αναδύθηκαν μπροστά του σαν φαντάσματα. Αντί όμως να τρέξει μακριά, τους κοίταξε κατάματα. Κατάλαβε πως η ψυχή, για να καθαριστεί, πρέπει να περάσει μέσα από τη δοκιμασία της ύλης.
            </p>
            <p>
              Καθώς προχωρούσε πιο βαθιά στο σκοτάδι, η ψυχρή στασιμότητα άρχισε να δίνει τη θέση της σε μια εσωτερική φλόγα. Η παρουσία του Πόρου και της Πενίας φώτισε το σκοτάδι· η έλλειψη και η αναζήτηση ενώθηκαν σε μια υπέρτατη επίγνωση. Ο Ιανεύς κατάλαβε ότι το 666 δεν ήταν σημάδι καταστροφής, αλλά ο κωδικός της ισορροπίας ανάμεσα στο σκοτάδι και το φως, στη σκιά και την πνευματική ανάδυση.
            </p>
            <p className="text-[#f5ecd8] italic font-semibold pt-2 border-t border-[#291f15]">
              Όταν επέστρεψε στην επιφάνεια του ΛΑΥΡΕΙΟΝ, ο Ιανεύς Τελιανός δεν ήταν πια ο ίδιος. Το βλέμμα του ακτινοβολούσε μια βαθιά, ακλόνητη ηρεμία. Είχε διασχίσει τα Τάρταρα της δικής του συνείδησης και είχε αναδυθεί στο φως του Παντός, φέρνοντας μαζί του την αλήθεια πως το σύμπαν ολόκληρο κατοικεί μέσα στην καρδιά του καθενός μας.
            </p>
          </div>

          {/* Ianeus Telianos Portrait Card */}
          <div className="lg:col-span-4 space-y-3">
            <div className="rounded-2xl bg-[#1c1610] border-2 border-[#c89b3c]/50 overflow-hidden shadow-2xl">
              <div className="aspect-square relative overflow-hidden group">
                <img 
                  src={ianeusImage} 
                  alt="Ιανεύς Τελιανός" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none flex flex-col justify-end p-4">
                  <div className="text-[10px] font-mono tracking-widest text-[#c89b3c] uppercase">
                    Ο Αναζητητης της Αληθειας
                  </div>
                  <h4 className="text-lg font-bold text-[#f5ecd8]">
                    ΙΑΝΕΥΣ ΤΕΛΙΑΝΟΣ
                  </h4>
                  <div className="text-xs font-mono text-[#e6c670] mt-0.5">
                    ΙΑΝΕΥΣ (666) + ΤΕΛΙΑΝΟΣ (666) = 1332
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2.5 bg-[#14100c] text-xs">
                <div className="space-y-1 pb-2 border-b border-[#2d2217]">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#a69680]">ΙΑΝΕΥΣ:</span>
                    <span className="font-mono text-[#e6c670]">10+1+50+5+400+200 = 666</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#a69680]">ΤΕΛΙΑΝΟΣ:</span>
                    <span className="font-mono text-[#e6c670]">300+5+30+10+1+50+70+200 = 666</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#c5b59e] leading-relaxed italic">
                  «Ο μυημένος που διασχίζει τον Άδη της ύλης και αναδύεται νικητής στο ηλιακό φως του Σουνίου και της Συμπαντικής Συνείδησης.»
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
