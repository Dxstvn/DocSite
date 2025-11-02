import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export default function DepressionNutritionPage() {
  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">Foods for Depression</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Medical Disclaimer</AlertTitle>
          <AlertDescription>
            This information is educational and not a substitute for professional medical advice.
            Always consult with your healthcare provider before making significant dietary changes,
            especially if you are taking medications for depression.
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <p className="text-lg">
            Research increasingly shows that nutrition plays a significant role in mental health.
            While food alone cannot cure depression, a nutrient-rich diet can support brain function,
            stabilize mood, and complement other treatments like therapy and medication.
          </p>
          <p>
            The gut-brain axis—the bidirectional communication between your digestive system and
            brain—means what you eat directly affects neurotransmitter production, inflammation
            levels, and overall brain health.
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="foods">
            <AccordionTrigger>Foods to Emphasize</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Fatty Fish</h3>
                <p>
                  <strong>Salmon, sardines, mackerel, anchovies</strong> are rich in omega-3 fatty
                  acids (EPA and DHA), which reduce brain inflammation and support neurotransmitter
                  function. Research shows omega-3s can reduce depression symptoms.
                </p>
                <p className="text-sm text-neutral-600">Aim for 2-3 servings per week.</p>

                <h3>Leafy Greens</h3>
                <p>
                  <strong>Spinach, kale, Swiss chard, collard greens</strong> provide folate
                  (vitamin B9), which is essential for producing serotonin and dopamine. Low folate
                  levels are associated with increased depression risk.
                </p>
                <p className="text-sm text-neutral-600">Include 1-2 cups daily in salads, smoothies, or cooked dishes.</p>

                <h3>Nuts and Seeds</h3>
                <p>
                  <strong>Walnuts, flaxseeds, chia seeds, almonds</strong> contain omega-3s, zinc,
                  and magnesium. Walnuts are particularly beneficial for brain health and mood regulation.
                </p>
                <p className="text-sm text-neutral-600">A handful (1 oz) daily as a snack or added to meals.</p>

                <h3>Berries</h3>
                <p>
                  <strong>Blueberries, strawberries, blackberries</strong> are rich in antioxidants
                  that protect the brain from oxidative stress and inflammation, both linked to depression.
                </p>
                <p className="text-sm text-neutral-600">½-1 cup daily, fresh or frozen.</p>

                <h3>Whole Grains</h3>
                <p>
                  <strong>Quinoa, oats, brown rice, whole wheat</strong> provide B vitamins and
                  complex carbohydrates that stabilize blood sugar and support serotonin production.
                </p>
                <p className="text-sm text-neutral-600">Choose whole grains over refined grains for sustained energy.</p>

                <h3>Fermented Foods</h3>
                <p>
                  <strong>Yogurt, kefir, kimchi, sauerkraut, kombucha</strong> contain probiotics
                  that support gut health. A healthy gut microbiome is crucial for neurotransmitter
                  production—90% of serotonin is made in the gut.
                </p>
                <p className="text-sm text-neutral-600">Include probiotic-rich foods daily.</p>

                <h3>Dark Chocolate</h3>
                <p>
                  <strong>70%+ cocoa content</strong> contains flavonoids and compounds that may
                  boost mood and reduce stress hormones. Dark chocolate also provides magnesium.
                </p>
                <p className="text-sm text-neutral-600">1-2 small squares (about 1 oz) as an occasional treat.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="nutrients">
            <AccordionTrigger>Key Nutrients for Depression</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Omega-3 Fatty Acids (EPA/DHA)</h3>
                <p>
                  Reduce inflammation, support neurotransmitter function, and improve brain cell membrane fluidity.
                  Multiple studies show EPA supplementation reduces depression symptoms.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Fatty fish, walnuts, flaxseeds, chia seeds
                </p>

                <h3>B Vitamins (B6, B12, Folate)</h3>
                <p>
                  Essential for producing serotonin, dopamine, and norepinephrine. Deficiencies in B vitamins
                  are common in depression.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Leafy greens, legumes, whole grains, eggs, fish, poultry
                </p>

                <h3>Vitamin D</h3>
                <p>
                  Vitamin D receptors are found throughout the brain. Deficiency is linked to seasonal
                  affective disorder (SAD) and major depression.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Sunlight exposure, fatty fish, fortified dairy, egg yolks, mushrooms
                </p>

                <h3>Magnesium</h3>
                <p>
                  Calms the nervous system, regulates stress response, and supports neurotransmitter function.
                  Low magnesium is associated with increased depression and anxiety.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Leafy greens, nuts, seeds, whole grains, dark chocolate, legumes
                </p>

                <h3>Zinc</h3>
                <p>
                  Modulates brain and body response to stress. Zinc deficiency is observed in depression,
                  and supplementation may enhance antidepressant effects.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Oysters, beef, pumpkin seeds, lentils, cashews
                </p>

                <h3>Tryptophan</h3>
                <p>
                  An amino acid that is the precursor to serotonin, the "feel-good" neurotransmitter.
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>Sources:</strong> Turkey, chicken, eggs, cheese, tofu, pumpkin seeds, oats
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="limit">
            <AccordionTrigger>Foods & Substances to Limit</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Processed Foods High in Sugar</h3>
                <p>
                  Causes blood sugar spikes and crashes that worsen mood instability. High sugar intake
                  is associated with increased depression risk and inflammation.
                </p>
                <p className="text-sm text-neutral-600">
                  Limit candy, soda, baked goods, and processed snacks.
                </p>

                <h3>Excessive Caffeine</h3>
                <p>
                  While moderate caffeine can improve alertness, excessive intake (>400mg/day, ~4 cups coffee)
                  can worsen anxiety, disrupt sleep, and cause mood crashes.
                </p>
                <p className="text-sm text-neutral-600">
                  Monitor your tolerance; some people with depression are more caffeine-sensitive.
                </p>

                <h3>Alcohol</h3>
                <p>
                  A central nervous system depressant that disrupts sleep, depletes B vitamins, and
                  interferes with antidepressant medications. Chronic use worsens depression.
                </p>
                <p className="text-sm text-neutral-600">
                  Limit or avoid alcohol, especially when experiencing depressive episodes.
                </p>

                <h3>Trans Fats & Highly Processed Oils</h3>
                <p>
                  Found in fried foods, margarine, and many packaged snacks. Trans fats increase
                  inflammation and are linked to higher depression rates.
                </p>
                <p className="text-sm text-neutral-600">
                  Choose olive oil, avocado oil, or coconut oil instead.
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
                    <a href="https://www.nimh.nih.gov/health/topics/depression" target="_blank" rel="noopener noreferrer">
                      National Institute of Mental Health (NIMH) - Depression
                    </a>
                  </li>
                  <li>
                    <a href="https://nutritionsource.hsph.harvard.edu/healthy-eating-plate/" target="_blank" rel="noopener noreferrer">
                      Harvard T.H. Chan School of Public Health - Nutrition & Mental Health
                    </a>
                  </li>
                  <li>
                    <strong>Key Studies:</strong>
                    <ul>
                      <li>Mediterranean diet and depression (SMILES trial, 2017)</li>
                      <li>Omega-3 fatty acids for depression (meta-analyses)</li>
                      <li>Gut-brain axis and mental health (emerging research)</li>
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
                  <li>Oatmeal topped with blueberries, walnuts, and a drizzle of honey</li>
                  <li>Greek yogurt with strawberries, chia seeds, and sliced almonds</li>
                  <li>Spinach and mushroom omelet with whole grain toast</li>
                  <li>Smoothie with kale, banana, berries, flaxseeds, and almond milk</li>
                </ul>

                <h3>Lunch Options</h3>
                <ul>
                  <li>Grilled salmon salad with mixed greens, avocado, and olive oil dressing</li>
                  <li>Quinoa bowl with roasted vegetables, chickpeas, and tahini sauce</li>
                  <li>Turkey and avocado wrap with whole wheat tortilla and vegetables</li>
                  <li>Lentil soup with kale and whole grain bread</li>
                </ul>

                <h3>Dinner Options</h3>
                <ul>
                  <li>Baked salmon with roasted sweet potato and steamed broccoli</li>
                  <li>Grilled chicken with quinoa and sautéed spinach</li>
                  <li>Sardines over mixed greens with cherry tomatoes and olive oil</li>
                  <li>Tofu stir-fry with brown rice and colorful vegetables</li>
                </ul>

                <h3>Snack Ideas</h3>
                <ul>
                  <li>Handful of walnuts or almonds</li>
                  <li>Greek yogurt with berries</li>
                  <li>Dark chocolate square (70%+ cocoa)</li>
                  <li>Apple slices with almond butter</li>
                  <li>Carrot sticks with hummus</li>
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
            <Link href="/education/depression">Learn About Depression</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
