import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export default function FocusNutritionPage() {
  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">Foods for Focus & Cognitive Function</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Medical Disclaimer</AlertTitle>
          <AlertDescription>
            This information is educational and not a substitute for professional medical advice.
            Nutrition strategies can support focus and cognitive function, but ADHD and attention
            difficulties require comprehensive treatment. Consult your healthcare provider.
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <p className="text-lg">
            Brain-healthy nutrition is essential for optimal focus, concentration, and cognitive performance.
            Certain foods support neurotransmitter production, improve blood flow to the brain, and provide
            sustained energy without crashes—all critical for attention and executive function.
          </p>
          <p>
            For those with ADHD, nutrition cannot replace medication or behavioral therapy, but it can
            significantly enhance treatment effectiveness and reduce symptoms.
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="foods">
            <AccordionTrigger>Foods to Emphasize</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Fatty Fish</h3>
                <p>
                  <strong>Salmon, sardines, anchovies, mackerel</strong> are the richest source of DHA,
                  an omega-3 fatty acid that makes up 40% of brain cell membranes. DHA is critical for
                  cognitive function, and low levels are linked to ADHD symptoms.
                </p>
                <p className="text-sm text-neutral-600">Aim for 2-3 servings per week.</p>

                <h3>Eggs</h3>
                <p>
                  Contain <strong>choline</strong>, a nutrient essential for producing acetylcholine—a
                  neurotransmitter crucial for memory and focus. Eggs also provide high-quality protein
                  for sustained energy.
                </p>
                <p className="text-sm text-neutral-600">1-2 eggs daily, especially at breakfast.</p>

                <h3>Blueberries</h3>
                <p>
                  Packed with antioxidants (flavonoids) that cross the blood-brain barrier, improving
                  communication between brain cells and enhancing memory and cognitive processing.
                </p>
                <p className="text-sm text-neutral-600">½-1 cup daily, fresh or frozen.</p>

                <h3>Nuts (Walnuts, Almonds)</h3>
                <p>
                  Rich in vitamin E, omega-3s, and magnesium—all support brain health and protect against
                  cognitive decline. Walnuts specifically improve working memory.
                </p>
                <p className="text-sm text-neutral-600">A handful (1 oz) as a snack or added to meals.</p>

                <h3>Green Tea</h3>
                <p>
                  Contains <strong>L-theanine</strong> plus moderate caffeine—a combination that promotes
                  calm, focused alertness without the jitters. L-theanine increases alpha brain waves
                  associated with relaxed concentration.
                </p>
                <p className="text-sm text-neutral-600">1-2 cups daily, especially mid-morning or afternoon.</p>

                <h3>Beets</h3>
                <p>
                  High in nitrates that improve blood flow to the brain, enhancing oxygen delivery and
                  cognitive performance. Studies show beets improve reaction time and decision-making.
                </p>
                <p className="text-sm text-neutral-600">Include in salads, juices, or roasted as a side dish.</p>

                <h3>Dark Chocolate</h3>
                <p>
                  Contains flavonoids, caffeine, and theobromine that enhance focus, mood, and alertness.
                  Choose 70%+ cocoa for maximum brain benefits and minimal sugar.
                </p>
                <p className="text-sm text-neutral-600">1-2 small squares (about 1 oz) daily.</p>

                <h3>Whole Grains</h3>
                <p>
                  <strong>Oats, quinoa, brown rice</strong> provide steady glucose to the brain (the brain's
                  primary fuel source). Complex carbs prevent blood sugar crashes that impair concentration.
                </p>
                <p className="text-sm text-neutral-600">Choose whole grains over refined grains for sustained focus.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="nutrients">
            <AccordionTrigger>Key Nutrients for Focus</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Omega-3 Fatty Acids (DHA & EPA)</h3>
                <p>
                  DHA is essential for brain structure and function. Research shows omega-3 supplementation
                  improves attention, reduces hyperactivity, and enhances cognitive performance in ADHD.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Fatty fish, walnuts, flaxseeds, chia seeds, algae oil (vegan)
                </p>

                <h3>B Vitamins (B6, B12, Folate)</h3>
                <p>
                  Critical for producing dopamine and norepinephrine—neurotransmitters that regulate
                  attention, motivation, and executive function. Deficiencies worsen ADHD symptoms.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Eggs, poultry, fish, leafy greens, legumes, fortified grains
                </p>

                <h3>Iron</h3>
                <p>
                  Transports oxygen to the brain and is involved in dopamine production. Low iron (even
                  without anemia) is linked to ADHD symptoms, especially inattention and fatigue.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Red meat, poultry, fish, lentils, spinach, fortified cereals
                </p>

                <h3>Zinc</h3>
                <p>
                  Regulates dopamine function and is often low in individuals with ADHD. Zinc supplementation
                  may enhance stimulant medication effectiveness.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Oysters, beef, pumpkin seeds, cashews, chickpeas
                </p>

                <h3>Protein (Amino Acids)</h3>
                <p>
                  Amino acids like tyrosine and tryptophan are precursors to dopamine, norepinephrine,
                  and serotonin. Protein at breakfast is especially important for sustained focus and
                  reducing impulsivity.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Eggs, Greek yogurt, lean meats, fish, tofu, legumes, nuts
                </p>

                <h3>Choline</h3>
                <p>
                  Essential for producing acetylcholine, which supports memory, learning, and attention.
                  Choline is particularly important during brain development but benefits adults too.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Eggs (especially yolks), liver, salmon, broccoli, Brussels sprouts
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="limit">
            <AccordionTrigger>Foods & Substances to Limit</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Simple Sugars & Refined Carbohydrates</h3>
                <p>
                  Cause rapid blood sugar spikes followed by crashes, which impair concentration, increase
                  hyperactivity, and worsen impulsivity. Consistent blood sugar is essential for focus.
                </p>
                <p className="text-sm text-neutral-600">
                  Avoid candy, soda, white bread, pastries; choose whole grains and pair carbs with protein.
                </p>

                <h3>Artificial Additives & Food Dyes</h3>
                <p>
                  Some studies suggest artificial colors (Red 40, Yellow 5, Yellow 6) and preservatives
                  may worsen hyperactivity in sensitive children, though research is mixed. The Feingold
                  Diet eliminates these additives.
                </p>
                <p className="text-sm text-neutral-600">
                  Consider eliminating for 2-4 weeks to see if symptoms improve; choose whole, unprocessed foods.
                </p>

                <h3>Excessive Caffeine</h3>
                <p>
                  While moderate caffeine can improve focus (especially paired with L-theanine in green tea),
                  excessive amounts cause jitteriness, anxiety, and sleep disruption—all worsen ADHD symptoms.
                </p>
                <p className="text-sm text-neutral-600">
                  Limit to <200mg/day; avoid caffeine after 2 PM to protect sleep.
                </p>

                <h3>Skipping Meals</h3>
                <p>
                  Missing meals causes blood sugar drops that significantly impair concentration, working
                  memory, and impulse control. Breakfast is especially critical for morning focus.
                </p>
                <p className="text-sm text-neutral-600">
                  Eat regular meals every 3-4 hours; include protein and complex carbs.
                </p>

                <h3>High-Allergen Foods (If Sensitive)</h3>
                <p>
                  Some individuals with ADHD have undiagnosed food sensitivities (dairy, gluten, soy)
                  that worsen symptoms. This is not true for everyone but worth exploring if symptoms persist.
                </p>
                <p className="text-sm text-neutral-600">
                  Work with a healthcare provider to identify potential sensitivities through elimination diet.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="research">
            <AccordionTrigger>Research & Evidence</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <ul>
                  <li>
                    <a href="https://chadd.org/about-adhd/diet-and-nutrition/" target="_blank" rel="noopener noreferrer">
                      CHADD (Children and Adults with Attention-Deficit/Hyperactivity Disorder)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd" target="_blank" rel="noopener noreferrer">
                      National Institute of Mental Health (NIMH) - ADHD
                    </a>
                  </li>
                  <li>
                    <strong>Key Research Findings:</strong>
                    <ul>
                      <li>Omega-3 supplementation improves ADHD symptoms (multiple meta-analyses)</li>
                      <li>Protein-rich breakfast improves attention and reduces hyperactivity</li>
                      <li>Iron and zinc deficiencies associated with ADHD severity</li>
                      <li>Mediterranean diet linked to better cognitive function</li>
                      <li>Elimination diets may help subset of individuals with food sensitivities</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="meals">
            <AccordionTrigger>Practical Meal Ideas</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Breakfast Options (Protein-Rich for Focus)</h3>
                <ul>
                  <li>Scrambled eggs with spinach, whole grain toast, and berries</li>
                  <li>Greek yogurt parfait with walnuts, blueberries, and chia seeds</li>
                  <li>Smoked salmon and avocado on whole grain bagel</li>
                  <li>Protein smoothie with banana, almond butter, oats, and flaxseeds</li>
                </ul>

                <h3>Lunch Options</h3>
                <ul>
                  <li>Tuna salad with beets, mixed greens, and olive oil dressing</li>
                  <li>Turkey and avocado wrap with whole wheat tortilla</li>
                  <li>Quinoa bowl with grilled chicken, broccoli, and tahini sauce</li>
                  <li>Lentil soup with kale and whole grain crackers</li>
                </ul>

                <h3>Dinner Options</h3>
                <ul>
                  <li>Grilled salmon with brown rice and roasted Brussels sprouts</li>
                  <li>Baked chicken with sweet potato and sautéed spinach</li>
                  <li>Sardines over whole grain pasta with cherry tomatoes</li>
                  <li>Beef stir-fry with colorful vegetables over quinoa</li>
                </ul>

                <h3>Snack Ideas (Sustained Energy)</h3>
                <ul>
                  <li>Hard-boiled eggs with cherry tomatoes</li>
                  <li>Walnuts and dark chocolate</li>
                  <li>Apple slices with almond butter</li>
                  <li>Green tea with a small piece of dark chocolate</li>
                  <li>Hummus with carrot and bell pepper sticks</li>
                </ul>

                <h3>Focus-Boosting Beverages</h3>
                <ul>
                  <li>Green tea (L-theanine + moderate caffeine)</li>
                  <li>Beet juice (improves blood flow to brain)</li>
                  <li>Blueberry smoothie with protein powder</li>
                  <li>Water (dehydration significantly impairs concentration)</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/contact">Schedule an Appointment</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/education/adhd">Learn About ADHD</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
