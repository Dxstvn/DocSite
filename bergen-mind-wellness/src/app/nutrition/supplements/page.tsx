import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info, AlertTriangle } from 'lucide-react'

export default function SupplementsPage() {
  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">Supplements & Nutrients for Mental Health</h1>

        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Safety Information</AlertTitle>
          <AlertDescription>
            <strong>Always consult your healthcare provider before starting any supplement.</strong>
            {' '}Supplements can interact with medications, cause side effects, and may not be appropriate
            for everyone. This information is educational only and not medical advice.
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <p className="text-lg">
            Supplements can play a supportive role in mental health treatment, but they should
            <strong> complement—not replace</strong>—a healthy diet, therapy, and prescribed medications.
            While some supplements have strong research support, the industry is largely unregulated,
            making quality and safety critical considerations.
          </p>
          <p>
            Work with your healthcare provider to determine which supplements, if any, are appropriate
            for your individual needs, medications, and health conditions.
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="omega3">
            <AccordionTrigger>Omega-3 Fish Oil (EPA & DHA)</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Evidence Level: <span className="text-primary-700">Strong</span></h3>
                <p>
                  Omega-3 fatty acids, particularly EPA (eicosapentaenoic acid) and DHA (docosahexaenoic acid),
                  have the most robust research support for mental health.
                </p>

                <h4>Mental Health Benefits:</h4>
                <ul>
                  <li><strong>Depression:</strong> Multiple meta-analyses show EPA-rich formulas reduce depression symptoms</li>
                  <li><strong>ADHD:</strong> Improves attention and reduces hyperactivity in children and adults</li>
                  <li><strong>Anxiety:</strong> May reduce anxiety symptoms, especially in those with high inflammation</li>
                </ul>

                <h4>Recommended Dosage:</h4>
                <p>1000-2000mg combined EPA+DHA daily. For depression, higher EPA ratios (EPA:DHA 2:1 or higher) may be more effective.</p>

                <h4>Quality Considerations:</h4>
                <ul>
                  <li>Third-party tested for purity (mercury, PCBs)</li>
                  <li>Molecularly distilled</li>
                  <li>Check for IFOS (International Fish Oil Standards) or USP certification</li>
                  <li>Refrigerate after opening to prevent oxidation</li>
                </ul>

                <h4>Safety:</h4>
                <p>Generally safe. May cause fishy aftertaste, upset stomach. High doses (>3g/day) may thin blood—consult doctor if on blood thinners.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="vitamin-d">
            <AccordionTrigger>Vitamin D</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Evidence Level: <span className="text-primary-700">Moderate to Strong</span></h3>
                <p>
                  Vitamin D deficiency is extremely common and strongly linked to depression, seasonal
                  affective disorder (SAD), and cognitive decline.
                </p>

                <h4>Mental Health Benefits:</h4>
                <ul>
                  <li><strong>Depression:</strong> Deficiency associated with depression; supplementation improves symptoms in deficient individuals</li>
                  <li><strong>Seasonal Affective Disorder (SAD):</strong> May reduce winter depression symptoms</li>
                  <li><strong>Cognitive Function:</strong> Supports brain health and may reduce dementia risk</li>
                </ul>

                <h4>Recommended Dosage:</h4>
                <p>
                  1000-2000 IU daily for maintenance. <strong>Test your blood levels first</strong>—optimal
                  range is 30-50 ng/mL. Higher doses may be needed to correct deficiency.
                </p>

                <h4>Quality Considerations:</h4>
                <ul>
                  <li>Vitamin D3 (cholecalciferol) is more effective than D2</li>
                  <li>Take with a meal containing fat for better absorption</li>
                  <li>Combine with magnesium and vitamin K2 for optimal metabolism</li>
                </ul>

                <h4>Safety:</h4>
                <p>Safe up to 4000 IU/day for most adults. Excessive doses can cause toxicity. Regular blood testing recommended.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="b-complex">
            <AccordionTrigger>B-Complex Vitamins</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Evidence Level: <span className="text-primary-700">Moderate</span></h3>
                <p>
                  B vitamins (B6, B12, folate) are essential for neurotransmitter production and are
                  often depleted in depression and chronic stress.
                </p>

                <h4>Mental Health Benefits:</h4>
                <ul>
                  <li><strong>B6, B12, Folate:</strong> Support serotonin, dopamine, and norepinephrine production</li>
                  <li><strong>B12 Deficiency:</strong> Causes depression, fatigue, and cognitive impairment (common in vegans/vegetarians)</li>
                  <li><strong>Folate (L-methylfolate):</strong> May enhance antidepressant effectiveness</li>
                </ul>

                <h4>Recommended Dosage:</h4>
                <p>B-complex containing 100% RDA of each B vitamin. For deficiency, higher therapeutic doses under medical supervision.</p>

                <h4>Who Benefits Most:</h4>
                <ul>
                  <li>Vegans and vegetarians (B12 deficiency risk)</li>
                  <li>Older adults (reduced absorption)</li>
                  <li>Those taking metformin or acid-reducing medications (interfere with B12 absorption)</li>
                  <li>Heavy alcohol users (B vitamin depletion)</li>
                </ul>

                <h4>Safety:</h4>
                <p>B vitamins are water-soluble and generally safe. Excess amounts are excreted in urine.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="magnesium">
            <AccordionTrigger>Magnesium</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Evidence Level: <span className="text-primary-700">Moderate</span></h3>
                <p>
                  Magnesium is involved in over 300 biochemical reactions, including those regulating
                  mood and stress response. Deficiency is common and linked to anxiety and depression.
                </p>

                <h4>Mental Health Benefits:</h4>
                <ul>
                  <li><strong>Anxiety:</strong> Natural muscle relaxant; calms nervous system</li>
                  <li><strong>Depression:</strong> Some studies show magnesium reduces depressive symptoms</li>
                  <li><strong>Sleep:</strong> Improves sleep quality (especially magnesium glycinate)</li>
                </ul>

                <h4>Recommended Dosage:</h4>
                <p>200-400mg daily. Best taken in divided doses with food.</p>

                <h4>Forms of Magnesium:</h4>
                <ul>
                  <li><strong>Magnesium Glycinate:</strong> Best for anxiety, sleep, gentle on stomach</li>
                  <li><strong>Magnesium Citrate:</strong> Good absorption, may have laxative effect</li>
                  <li><strong>Magnesium L-Threonate:</strong> Crosses blood-brain barrier, supports cognition</li>
                  <li><strong>Avoid Magnesium Oxide:</strong> Poor absorption</li>
                </ul>

                <h4>Safety:</h4>
                <p>Generally safe. High doses may cause diarrhea. Avoid if you have kidney disease. May interact with certain medications.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="probiotics">
            <AccordionTrigger>Probiotics</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Evidence Level: <span className="text-primary-700">Emerging</span></h3>
                <p>
                  The gut-brain axis is a major area of mental health research. Specific probiotic
                  strains produce neurotransmitters and regulate the stress response via the vagus nerve.
                </p>

                <h4>Mental Health Benefits:</h4>
                <ul>
                  <li><strong>Anxiety & Depression:</strong> Certain strains (Lactobacillus, Bifidobacterium) may reduce symptoms</li>
                  <li><strong>Stress Resilience:</strong> May reduce cortisol and improve stress response</li>
                  <li><strong>Gut Health:</strong> Supports overall digestive health</li>
                </ul>

                <h4>Recommended Dosage:</h4>
                <p>10-50 billion CFU daily from multi-strain formula. Refrigerated probiotics tend to have higher viability.</p>

                <h4>Beneficial Strains for Mental Health:</h4>
                <ul>
                  <li>Lactobacillus helveticus</li>
                  <li>Bifidobacterium longum</li>
                  <li>Lactobacillus rhamnosus</li>
                </ul>

                <h4>Safety:</h4>
                <p>Generally safe. May cause gas or bloating initially. Those with compromised immune systems should consult a doctor first.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="same">
            <AccordionTrigger>SAMe (S-Adenosyl Methionine)</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Evidence Level: <span className="text-primary-700">Moderate</span></h3>
                <p>
                  SAMe is a compound naturally produced in the body that supports neurotransmitter
                  function and has antidepressant properties.
                </p>

                <h4>Mental Health Benefits:</h4>
                <ul>
                  <li><strong>Depression:</strong> Multiple studies show SAMe as effective as some antidepressants</li>
                  <li><strong>Onset:</strong> May work faster than SSRIs (1-2 weeks vs 4-6 weeks)</li>
                </ul>

                <h4>Recommended Dosage:</h4>
                <p>400-1600mg daily in divided doses. Start low and increase gradually.</p>

                <h4>Important Considerations:</h4>
                <ul>
                  <li><strong>Medical Supervision Required:</strong> Can interact with antidepressants</li>
                  <li><strong>Not for Bipolar:</strong> May trigger mania in bipolar disorder</li>
                  <li><strong>Quality Matters:</strong> Enteric-coated formulas more stable</li>
                  <li>Expensive compared to other supplements</li>
                </ul>

                <h4>Safety:</h4>
                <p>Generally well-tolerated but can cause GI upset, anxiety, or insomnia. <strong>Do not combine with antidepressants without medical supervision.</strong></p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="l-theanine">
            <AccordionTrigger>L-Theanine</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Evidence Level: <span className="text-primary-700">Moderate</span></h3>
                <p>
                  An amino acid found in green tea that promotes relaxation without sedation by
                  increasing alpha brain waves.
                </p>

                <h4>Mental Health Benefits:</h4>
                <ul>
                  <li><strong>Anxiety:</strong> Reduces acute anxiety and promotes calm focus</li>
                  <li><strong>Focus:</strong> Paired with caffeine, improves attention and reduces jitters</li>
                  <li><strong>Sleep Quality:</strong> May improve sleep without causing drowsiness during the day</li>
                </ul>

                <h4>Recommended Dosage:</h4>
                <p>100-200mg as needed, 1-3 times daily. Often combined with caffeine (1:2 ratio) for focused energy.</p>

                <h4>Safety:</h4>
                <p>Extremely safe with minimal side effects. No known drug interactions. Non-habit forming.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="caution">
            <AccordionTrigger>Supplements to Approach Cautiously</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>St. John's Wort</h3>
                <p>
                  <strong>Evidence for depression but serious drug interactions.</strong> St. John's
                  Wort reduces effectiveness of many medications including birth control, blood thinners,
                  and antidepressants. Can cause serotonin syndrome if combined with SSRIs.
                </p>
                <p className="text-sm text-error-700">
                  <strong>Only use under medical supervision. Never combine with prescription antidepressants.</strong>
                </p>

                <h3>High-Dose Vitamins</h3>
                <p>
                  Mega-doses of fat-soluble vitamins (A, D, E, K) can accumulate and cause toxicity.
                  More is not better—follow recommended dosages.
                </p>

                <h3>Unregulated Herbal Supplements</h3>
                <p>
                  Many herbal supplements lack quality control, may be contaminated with heavy metals,
                  and have inconsistent potency. Stick with third-party tested brands.
                </p>

                <h3>Kava</h3>
                <p>
                  While effective for anxiety, kava has been linked to liver damage in some individuals.
                  Avoid if you have liver disease or take medications affecting the liver.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="safety">
            <AccordionTrigger>Safety & Quality Considerations</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>FDA Regulation</h3>
                <p>
                  <strong>Supplements are NOT FDA-regulated like medications.</strong> Manufacturers
                  are not required to prove safety or effectiveness before selling. This makes quality
                  control critical.
                </p>

                <h3>Third-Party Testing</h3>
                <p>Look for these certifications on supplement labels:</p>
                <ul>
                  <li><strong>USP Verified:</strong> Purity, potency, and quality tested</li>
                  <li><strong>NSF Certified:</strong> Independent testing for contaminants</li>
                  <li><strong>ConsumerLab:</strong> Third-party verification</li>
                  <li><strong>IFOS (Fish Oil):</strong> International Fish Oil Standards</li>
                </ul>

                <h3>Medication Interactions</h3>
                <p>
                  <strong>Always tell your healthcare provider about all supplements you take.</strong>
                  {' '}Common interactions include:
                </p>
                <ul>
                  <li>Omega-3s + blood thinners (increased bleeding risk)</li>
                  <li>St. John's Wort + SSRIs (serotonin syndrome)</li>
                  <li>Vitamin K + warfarin (reduced medication effectiveness)</li>
                  <li>Magnesium + certain antibiotics (reduced absorption)</li>
                </ul>

                <h3>When to Avoid Supplements</h3>
                <ul>
                  <li>Pregnancy/breastfeeding (unless approved by doctor)</li>
                  <li>Before surgery (some increase bleeding risk)</li>
                  <li>Liver or kidney disease (certain supplements contraindicated)</li>
                  <li>Bipolar disorder (some supplements may trigger mania)</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="research">
            <AccordionTrigger>Research & Evidence</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <ul>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/mental-health-medications" target="_blank" rel="noopener noreferrer">
                      National Institute of Mental Health (NIMH) - Mental Health Medications & Supplements
                    </a>
                  </li>
                  <li>
                    <a href="https://ods.od.nih.gov/" target="_blank" rel="noopener noreferrer">
                      NIH Office of Dietary Supplements
                    </a>
                  </li>
                  <li>
                    <a href="https://www.cochrane.org/" target="_blank" rel="noopener noreferrer">
                      Cochrane Reviews - Evidence-Based Supplement Research
                    </a>
                  </li>
                  <li>
                    <a href="https://www.consumerlab.com/" target="_blank" rel="noopener noreferrer">
                      ConsumerLab - Independent Supplement Testing
                    </a>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>The Bottom Line</AlertTitle>
          <AlertDescription>
            Supplements can be valuable tools in mental health treatment, but they work best as part
            of a comprehensive approach that includes therapy, lifestyle changes, and—when appropriate—
            medication. Always prioritize quality, work with your healthcare provider, and remember that
            no supplement can replace professional treatment for mental health conditions.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/contact">Discuss Supplements with a Provider</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/nutrition">Back to Nutrition Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
