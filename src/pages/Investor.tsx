'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Check,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  Star,
  LineChart,
  Building2,
  BarChart,
  Shield,
  Users,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useTheme } from '@/context/ThemeProvider'

const features = [
  {
    title: 'AI-Powered Analysis',
    description:
      'Advanced algorithms analyze financial reports to extract key insights and trends.',
    icon: <Zap className="size-5" />,
  },
  {
    title: 'Real-Time Analytics',
    description:
      'Get instant access to financial metrics and performance indicators.',
    icon: <BarChart className="size-5" />,
  },
  {
    title: 'Collaborative Platform',
    description:
      'Share insights and collaborate with your investment team seamlessly.',
    icon: <Users className="size-5" />,
  },
  {
    title: 'Data Security',
    description:
      'Enterprise-grade security to protect your sensitive financial data.',
    icon: <Shield className="size-5" />,
  },
  {
    title: 'Custom Reports',
    description:
      'Generate tailored reports and visualizations for your specific needs.',
    icon: <LineChart className="size-5" />,
  },
  {
    title: 'Company Research',
    description: 'Deep dive into company financials and market positioning.',
    icon: <Building2 className="size-5" />,
  },
]

export default function InvestorPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden relative bg-background">
        <div className="absolute inset-0 h-full w-full bg-background">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <Badge
              className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium"
              variant="secondary"
            >
              AI-Powered Investment Analysis
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Make Smarter Investment Decisions
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our AI-powered platform analyzes financial reports in seconds,
              giving you deep insights and helping you make data-driven
              investment decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full h-12 px-8 text-base">
                Start Free Trial
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-12 px-8 text-base"
              >
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Check className="size-4 text-primary" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="size-4 text-primary" />
                <span>14-day trial</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="size-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto max-w-5xl"
          >
            <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
              <img
                src="https://cdn.dribbble.com/userupload/12302729/file/original-fa372845e394ee85bebe0389b9d86871.png?resize=1504x1128&vertical=center"
                alt="Investment Analysis Dashboard"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
            <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
          </motion.div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="w-full py-12 border-y bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Trusted by leading investment firms worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`/placeholder-logo.svg`}
                  alt={`Investment firm logo ${i}`}
                  width={120}
                  height={60}
                  className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <Badge
              className="rounded-full px-4 py-1.5 text-sm font-medium"
              variant="secondary"
            >
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Powerful Investment Tools
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-lg">
              Our comprehensive platform provides all the tools you need to
              analyze financial reports, track performance, and make informed
              investment decisions.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={item}>
                <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 h-full w-full bg-background">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]" />
        </div>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
          >
            <Badge
              className="rounded-full px-4 py-1.5 text-sm font-medium"
              variant="secondary"
            >
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Smart Analysis, Better Returns
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-lg">
              Start making data-driven investment decisions in minutes with our
              AI-powered platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

            {[
              {
                step: '01',
                title: 'Upload Reports',
                description:
                  'Simply upload financial reports and documents. We support all major formats and sources.',
              },
              {
                step: '02',
                title: 'AI Analysis',
                description:
                  'Our AI analyzes the data, extracting key metrics and identifying trends automatically.',
              },
              {
                step: '03',
                title: 'Make Decisions',
                description:
                  'Get actionable insights and recommendations to make informed investment choices.',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center space-y-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <Badge
              className="rounded-full px-4 py-1.5 text-sm font-medium"
              variant="secondary"
            >
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Trusted by Investment Professionals
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-lg">
              See how our platform has helped investors make better decisions
              and achieve higher returns.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote:
                  "The AI analysis has completely transformed how we evaluate investment opportunities. We're seeing better returns and saving countless hours.",
                author: 'Sarah Chen',
                role: 'Portfolio Manager, Capital Ventures',
                rating: 5,
              },
              {
                quote:
                  "The insights provided by the platform have helped us identify opportunities we would have otherwise missed. It's like having a team of analysts working 24/7.",
                author: 'Michael Rodriguez',
                role: 'Investment Director, Global Funds',
                rating: 5,
              },
              {
                quote:
                  "The accuracy and speed of the financial analysis are impressive. It's become an indispensable tool for our investment strategy.",
                author: 'Emily Zhang',
                role: 'Senior Analyst, Tech Investments',
                rating: 5,
              },
              {
                quote:
                  "We've significantly improved our due diligence process. The platform helps us make faster, more confident investment decisions.",
                author: 'David Park',
                role: 'Managing Partner, Growth Equity',
                rating: 5,
              },
              {
                quote:
                  "The collaborative features have made it easy for our team to work together on investment analysis, even when we're in different locations.",
                author: 'Lisa Thompson',
                role: 'Investment Manager, Asset Management',
                rating: 5,
              },
              {
                quote:
                  "The ROI on this platform has been exceptional. We've seen a 40% increase in our analysis efficiency since implementing it.",
                author: 'James Wilson',
                role: 'Chief Investment Officer, Wealth Management',
                rating: 5,
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex mb-4">
                      {Array(testimonial.rating)
                        .fill(0)
                        .map((_, j) => (
                          <Star
                            key={j}
                            className="size-4 text-yellow-500 fill-yellow-500"
                          />
                        ))}
                    </div>
                    <p className="text-lg mb-6 flex-grow">
                      {testimonial.quote}
                    </p>
                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/40">
                      <div className="size-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 h-full w-full bg-background">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]" />
        </div>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <Badge
              className="rounded-full px-4 py-1.5 text-sm font-medium"
              variant="secondary"
            >
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Investment Plans for Every Scale
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-lg">
              Choose the plan that matches your investment needs. All plans
              include our core AI analysis features.
            </p>
          </motion.div>

          <div className="mx-auto max-w-5xl">
            <Tabs defaultValue="monthly" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="rounded-full p-1">
                  <TabsTrigger value="monthly" className="rounded-full px-6">
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger value="annually" className="rounded-full px-6">
                    Annually (Save 20%)
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="monthly">
                <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                  {[
                    {
                      name: 'Individual',
                      price: '$99',
                      description:
                        'Perfect for individual investors and analysts.',
                      features: [
                        'Up to 50 reports/month',
                        'Basic AI analysis',
                        '5GB storage',
                        'Email support',
                      ],
                      cta: 'Start Free Trial',
                    },
                    {
                      name: 'Professional',
                      price: '$299',
                      description: 'Ideal for investment firms and teams.',
                      features: [
                        'Unlimited reports',
                        'Advanced AI analysis',
                        '25GB storage',
                        'Priority support',
                        'Team collaboration',
                      ],
                      cta: 'Start Free Trial',
                      popular: true,
                    },
                    {
                      name: 'Enterprise',
                      price: 'Custom',
                      description: 'For large institutions with complex needs.',
                      features: [
                        'Custom report limits',
                        'Custom AI models',
                        'Unlimited storage',
                        '24/7 phone & email support',
                        'Advanced API access',
                        'Custom integrations',
                      ],
                      cta: 'Contact Sales',
                    },
                  ].map((plan, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <Card
                        className={`relative overflow-hidden h-full ${
                          plan.popular
                            ? 'border-primary shadow-lg'
                            : 'border-border/40 shadow-md'
                        } bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                      >
                        {plan.popular && (
                          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                            Most Popular
                          </div>
                        )}
                        <CardContent className="p-6 flex flex-col h-full">
                          <h3 className="text-2xl font-bold">{plan.name}</h3>
                          <div className="flex items-baseline mt-4">
                            <span className="text-4xl font-bold">
                              {plan.price}
                            </span>
                            <span className="text-muted-foreground ml-1">
                              /month
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-2">
                            {plan.description}
                          </p>
                          <ul className="space-y-3 my-6 flex-grow">
                            {plan.features.map((feature, j) => (
                              <li key={j} className="flex items-center">
                                <Check className="mr-2 size-4 text-primary" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button
                            className={`w-full mt-auto rounded-full ${
                              plan.popular
                                ? 'bg-primary hover:bg-primary/90'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                            variant={plan.popular ? 'default' : 'outline'}
                          >
                            {plan.cta}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="annually">
                {/* Similar structure as monthly but with discounted prices */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <Badge
              className="rounded-full px-4 py-1.5 text-sm font-medium"
              variant="secondary"
            >
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Common Questions
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-lg">
              Find answers to frequently asked questions about our investment
              analysis platform.
            </p>
          </motion.div>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: 'How accurate is the AI analysis?',
                  answer:
                    'Our AI models have been trained on millions of financial reports and achieve over 95% accuracy in extracting and analyzing financial data. We continuously update and improve our models based on real-world performance and feedback.',
                },
                {
                  question: 'Can I integrate with my existing tools?',
                  answer:
                    'Yes, we offer API integration with major financial software and platforms. Our Professional and Enterprise plans include full API access and custom integration support.',
                },
                {
                  question: 'How secure is my financial data?',
                  answer:
                    "We employ bank-level security measures including end-to-end encryption, secure data centers, and regular security audits. We're compliant with SOC 2, GDPR, and other relevant regulations.",
                },
                {
                  question: 'Do you support international markets?',
                  answer:
                    'Yes, our platform supports financial reports and documents from major markets worldwide. We can analyze reports in multiple languages and currencies.',
                },
                {
                  question: 'What type of reports can be analyzed?',
                  answer:
                    'We support all standard financial documents including annual reports, quarterly statements, balance sheets, income statements, and cash flow statements. We can also analyze presentations and regulatory filings.',
                },
                {
                  question: 'How long does the analysis take?',
                  answer:
                    'Most reports are analyzed within minutes. Complex documents or bulk uploads may take longer. Real-time analysis updates are available as new data comes in.',
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <AccordionItem
                    value={`item-${i}`}
                    className="border-b border-border/40 py-2"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-6 text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Ready to Transform Your Investment Analysis?
            </h2>
            <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
              Join thousands of successful investors who use our platform to
              make smarter, data-driven investment decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full h-12 px-8 text-base"
              >
                Start Free Trial
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-12 px-8 text-base bg-transparent border-white text-white hover:bg-white/10"
              >
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm text-primary-foreground/80 mt-4">
              No credit card required. 14-day free trial. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
