import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export default function AnxietyNutritionPage() {
  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">Foods for Anxiety</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Medical Disclaimer</AlertTitle>
          <AlertDescription>
            This information is educational and not a substitute for professional medical advice.
            Always consult with your healthcare provider before making significant dietary changes,
            especially if you are taking medications for anxiety.
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <p className="text-lg">
            Nutrition plays a crucial role in managing anxiety. Certain foods can help calm the nervous
            system, stabilize blood sugar levels, and support neurotransmitter balance—all of which
            influence anxiety levels.
          </p>
          <p>
            While dietary changes alone may not eliminate anxiety, they can significantly reduce symptoms
            and complement other treatments like therapy, medication, and stress management techniques.
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="foods">
            <AccordionTrigger>Foods to Emphasize</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Fatty Fish</h3>
                <p>
                  <strong>Salmon, sardines, mackerel</strong> are rich in omega-3 fatty acids, which
                  reduce inflammation and have been shown to decrease anxiety symptoms in multiple studies.
                </p>
                <p className="text-sm text-neutral-600">Aim for 2-3 servings per week.</p>

                <h3>Dark Leafy Greens</h3>
                <p>
                  <strong>Spinach, kale, Swiss chard</strong> are high in magnesium, a natural muscle
                  relaxant that calms the nervous system. Magnesium deficiency is linked to increased anxiety.
                </p>
                <p className="text-sm text-neutral-600">Include 1-2 cups daily in salads, smoothies, or sautéed.</p>

                <h3>Chamomile Tea</h3>
                <p>
                  Contains apigenin, an antioxidant that binds to brain receptors promoting relaxation
                  and reducing anxiety. Chamomile has been used for centuries as a natural calming agent.
                </p>
                <p className="text-sm text-neutral-600">1-2 cups daily, especially in the evening.</p>

                <h3>Almonds</h3>
                <p>
                  Rich in magnesium and vitamin E, both of which support stress reduction. Almonds also
                  provide healthy fats that stabilize blood sugar and mood.
                </p>
                <p className="text-sm text-neutral-600">A handful (1 oz) as a snack or added to meals.</p>

                <h3>Avocados</h3>
                <p>
                  Loaded with B vitamins (especially B6) that support neurotransmitter production and
                  stress response. The healthy fats promote brain health and stabilize mood.
                </p>
                <p className="text-sm text-neutral-600">½ avocado daily in salads, sandwiches, or smoothies.</p>

                <h3>Turkey</h3>
                <p>
                  Contains tryptophan, an amino acid that produces serotonin—a neurotransmitter that
                  promotes calm and well-being.
                </p>
                <p className="text-sm text-neutral-600">Lean protein at lunch or dinner.</p>

                <h3>Bananas</h3>
                <p>
                  Provide vitamin B6, which helps produce serotonin, and potassium, which regulates
                  blood pressure during stress. The natural sugars offer quick energy without a crash.
                </p>
                <p className="text-sm text-neutral-600">1-2 bananas daily as a snack or in smoothies.</p>

                <h3>Complex Carbohydrates</h3>
                <p>
                  <strong>Oats, quinoa, sweet potatoes, brown rice</strong> promote steady serotonin
                  release and stabilize blood sugar, preventing the mood swings associated with anxiety.
                </p>
                <p className="text-sm text-neutral-600">Choose whole grains over refined carbs for sustained calm.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="nutrients">
            <AccordionTrigger>Key Nutrients for Anxiety</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Magnesium</h3>
                <p>
                  The "relaxation mineral" that calms the nervous system, relaxes muscles, and supports
                  GABA production (the brain's calming neurotransmitter). Magnesium deficiency is common
                  in anxiety disorders.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Leafy greens, almonds, cashews, black beans, dark chocolate, avocados
                </p>

                <h3>B Vitamins (B6, B12, Folate)</h3>
                <p>
                  Essential for producing neurotransmitters that regulate mood and stress response.
                  B vitamins are depleted during chronic stress, creating a cycle of increased anxiety.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Turkey, chicken, fish, eggs, leafy greens, legumes, whole grains
                </p>

                <h3>Omega-3 Fatty Acids</h3>
                <p>
                  Reduce inflammation and support brain cell membrane function. Research shows omega-3
                  supplementation reduces anxiety symptoms, particularly in those with high inflammation.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Fatty fish, walnuts, flaxseeds, chia seeds, hemp seeds
                </p>

                <h3>Probiotics</h3>
                <p>
                  Support the gut-brain axis. Studies show specific probiotic strains reduce anxiety by
                  producing GABA and regulating the stress response through the vagus nerve.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Yogurt, kefir, kimchi, sauerkraut, kombucha, miso
                </p>

                <h3>L-Theanine</h3>
                <p>
                  An amino acid found in green tea that promotes relaxation without sedation. L-theanine
                  increases alpha brain waves associated with calm alertness.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Green tea, black tea, certain mushrooms
                </p>

                <h3>Antioxidants</h3>
                <p>
                  Protect the brain from oxidative stress caused by chronic anxiety. Antioxidant-rich
                  diets are associated with lower anxiety levels.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Berries, dark chocolate, green tea, colorful vegetables
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="limit">
            <AccordionTrigger>Foods & Substances to Limit</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Caffeine</h3>
                <p>
                  A stimulant that increases heart rate, triggers the release of stress hormones (cortisol,
                  adrenaline), and can worsen anxiety symptoms. Caffeine sensitivity varies, but many
                  with anxiety benefit from reducing or eliminating it.
                </p>
                <p className="text-sm text-neutral-600">
                  Limit to <200mg/day (~2 cups coffee) or switch to green tea for gentler caffeine with L-theanine.
                </p>

                <h3>Alcohol</h3>
                <p>
                  While it may temporarily reduce anxiety, alcohol disrupts sleep, depletes B vitamins,
                  and causes rebound anxiety as it wears off. Chronic use worsens anxiety long-term.
                </p>
                <p className="text-sm text-neutral-600">
                  Minimize or avoid alcohol, especially during high-anxiety periods.
                </p>

                <h3>High-Sugar Foods</h3>
                <p>
                  Cause rapid blood sugar spikes followed by crashes, which trigger anxiety-like symptoms
                  (shakiness, irritability, rapid heartbeat). High sugar intake is linked to increased anxiety.
                </p>
                <p className="text-sm text-neutral-600">
                  Avoid candy, soda, baked goods; choose whole fruits instead.
                </p>

                <h3>Processed Foods</h3>
                <p>
                  High in trans fats, artificial additives, and refined carbs that promote inflammation
                  and blood sugar instability—both worsen anxiety.
                </p>
                <p className="text-sm text-neutral-600">
                  Choose whole, unprocessed foods whenever possible.
                </p>

                <h3>High-Sodium Foods</h3>
                <p>
                  Excessive salt can raise blood pressure and exacerbate physical anxiety symptoms. Many
                  processed foods contain hidden sodium.
                </p>
                <p className="text-sm text-neutral-600">
                  Limit processed meats, canned soups, fast food; use herbs and spices for flavor instead.
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
                    <a href="https://adaa.org/living-with-anxiety/managing-anxiety/exercise-stress-and-anxiety" target="_blank" rel="noopener noreferrer">
                      Anxiety & Depression Association of America (ADAA)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/anxiety-disorders" target="_blank" rel="noopener noreferrer">
                      National Institute of Mental Health (NIMH) - Anxiety Disorders
                    </a>
                  </li>
                  <li>
                    <strong>Key Research Findings:</strong>
                    <ul>
                      <li>Magnesium supplementation reduces subjective anxiety (multiple RCTs)</li>
                      <li>Omega-3 fatty acids decrease anxiety symptoms (meta-analysis, 2018)</li>
                      <li>Probiotics reduce anxiety via gut-brain axis (emerging evidence)</li>
                      <li>Mediterranean diet associated with lower anxiety rates</li>
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
                <h3>Breakfast Options</h3>
                <ul>
                  <li>Greek yogurt parfait with banana, almonds, and honey</li>
                  <li>Oatmeal with berries, flaxseeds, and almond butter</li>
                  <li>Scrambled eggs with spinach and avocado on whole grain toast</li>
                  <li>Green smoothie with kale, banana, chia seeds, and almond milk</li>
                </ul>

                <h3>Lunch Options</h3>
                <ul>
                  <li>Turkey and avocado wrap with mixed greens and hummus</li>
                  <li>Salmon salad with spinach, walnuts, and olive oil dressing</li>
                  <li>Quinoa bowl with roasted vegetables and tahini sauce</li>
                  <li>Lentil soup with kale and whole grain crackers</li>
                </ul>

                <h3>Dinner Options</h3>
                <ul>
                  <li>Baked salmon with sweet potato and steamed broccoli</li>
                  <li>Grilled chicken with brown rice and sautéed spinach</li>
                  <li>Turkey meatballs with whole wheat pasta and marinara sauce</li>
                  <li>Stir-fried tofu with vegetables over quinoa</li>
                </ul>

                <h3>Snack Ideas</h3>
                <ul>
                  <li>Handful of almonds or cashews</li>
                  <li>Banana with almond butter</li>
                  <li>Dark chocolate square (70%+ cocoa)</li>
                  <li>Chamomile tea with honey</li>
                  <li>Avocado on whole grain crackers</li>
                </ul>

                <h3>Calming Beverages</h3>
                <ul>
                  <li>Chamomile tea (any time, especially evening)</li>
                  <li>Green tea (morning/afternoon for calm focus)</li>
                  <li>Warm golden milk (turmeric, ginger, almond milk, honey)</li>
                  <li>Magnesium-rich smoothies</li>
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
            <Link href="/education/anxiety">Learn About Anxiety</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
