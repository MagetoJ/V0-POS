'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronDown,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  Search,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs: FAQItem[] = [
    {
      question: 'How do I clock in and out?',
      answer:
        'To clock in or out, navigate to the Dashboard and click the "Clock In/Out" button at the top. Your clock-in/out time will be recorded automatically. Make sure to clock in when you arrive and clock out when you leave.',
    },
    {
      question: 'How can I request a shift swap?',
      answer:
        'Go to the Shifts page and click "Request Shift Swap". Select the shift you want to swap from your shift history. Submit your request and a manager will review it. You\'ll be notified once your request is approved or denied.',
    },
    {
      question: 'Where can I see my performance metrics?',
      answer:
        'Visit the Performance page to view your sales trends, customer satisfaction ratings, and other key metrics. You can see daily breakdowns and weekly summaries of your performance.',
    },
    {
      question: 'How do I change my PIN?',
      answer:
        'Go to Settings and scroll down to the Security Settings section. Enter your current PIN, then enter and confirm your new PIN. Your PIN must be at least 4 digits long.',
    },
    {
      question: 'Why can\'t I see my shift swap request?',
      answer:
        'Pending shift swap requests appear in your Shifts page under "Pending Requests". If you don\'t see one, check if it has been approved or rejected. You can also contact your manager for status updates.',
    },
    {
      question: 'How often is my performance data updated?',
      answer:
        'Your performance data is updated in real-time as you complete transactions. Sales figures, customer satisfaction ratings, and other metrics reflect your most recent activity.',
    },
  ];

  const filteredFaqs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          <div className="pt-12 lg:pt-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Help & Support
            </h1>
            <p className="text-muted-foreground mt-2">
              Find answers to common questions or contact our support team
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border bg-card/50 hover:bg-card/70 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Call Support</p>
                    <p className="text-sm text-muted-foreground mt-1">1-800-POS-HELP</p>
                    <p className="text-xs text-muted-foreground mt-2">Mon-Fri, 9AM-6PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 hover:bg-card/70 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email Support</p>
                    <p className="text-sm text-muted-foreground mt-1">support@mariahavenpos.com</p>
                    <p className="text-xs text-muted-foreground mt-2">Response within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 hover:bg-card/70 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Chat Support</p>
                    <p className="text-sm text-muted-foreground mt-1">Live chat available</p>
                    <p className="text-xs text-muted-foreground mt-2">During business hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-2">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => (
                  <Card
                    key={idx}
                    className="border-border bg-card/50 overflow-hidden cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <HelpCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
                        <p className="font-medium text-foreground">{faq.question}</p>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform shrink-0 ${
                          expandedFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    {expandedFaq === idx && (
                      <div className="px-4 pb-4 border-t border-border pt-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <Card className="border-border bg-card/50">
                  <CardContent className="pt-8 pb-8">
                    <p className="text-center text-muted-foreground">No FAQs found matching your search.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-foreground">Still need help?</CardTitle>
              <CardDescription>Submit a support request</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Subject
                  </label>
                  <Input
                    type="text"
                    placeholder="Brief description of your issue"
                    className="bg-background border-input text-foreground focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe your issue in detail"
                    rows={5}
                    className="w-full bg-background border border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 rounded-lg p-3"
                  />
                </div>

                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium w-full">
                  Submit Support Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
