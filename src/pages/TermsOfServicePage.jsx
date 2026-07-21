import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import logo from '../assets/logo_transparent.png'

export default function TermsOfServicePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-16">
      {/* Top App Bar */}
      <header className="bg-[#FFF8F0] sticky top-0 z-40 border-b border-[#e1bfb5]/20 backdrop-blur-md">
        <div className="flex justify-between items-center px-4 md:px-16 w-full max-w-7xl mx-auto h-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-[#fff1ed] transition-colors rounded-full text-[#594139] active:scale-95 cursor-pointer"
            >
              <Icon name="arrow_back" />
            </button>
            <div className="w-8 h-8 bg-white rounded-lg p-1 shadow-sm flex items-center justify-center border border-[#e1bfb5]/20">
              <img src={logo} alt="Food Genie" className="w-full h-full object-contain" />
            </div>
            <span className="text-[20px] font-bold text-[#ab3500] hidden sm:inline">Food Genie</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[14px] font-semibold text-[#594139]">Terms of Service</span>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ffdbd0] bg-[#fde3db] flex items-center justify-center">
              <Icon name="gavel" filled className="text-[#ab3500]" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white p-6 md:p-10 rounded-3xl modern-tactile-card border border-[#f7ddd5] space-y-8">
          
          {/* Document Header */}
          <div className="border-b border-[#f7ddd5] pb-6">
            <h1 className="text-[28px] md:text-[36px] font-extrabold text-[#261814] leading-tight">Terms of Service</h1>
            <p className="text-[14px] text-[#594139] mt-2">Last Updated: July 8, 2026</p>
          </div>

          {/* Intro */}
          <div className="text-[16px] text-[#594139] leading-relaxed space-y-4">
            <p>
              Welcome to Food Genie. These Terms of Service (<strong>"Terms"</strong>) govern your access to and use of the Food Genie application and services, including our Customer, Restaurant, Rider, and Admin portals (collectively, the <strong>"Platform"</strong>). By creating an account or using Food Genie, you agree to be bound by these Terms.
            </p>
            <p>
              If you do not agree to these Terms, please do not use the Platform.
            </p>
          </div>

          {/* 1. Definitions */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">1</span>
              Definitions
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>"Platform"</strong> refers to the Food Genie mobile/web application and all associated services.</li>
                <li><strong>"User"</strong> refers to any person using the Platform, including Customers, Restaurant Partners, and Riders.</li>
                <li><strong>"Customer"</strong> refers to a user who orders food through the Platform.</li>
                <li><strong>"Restaurant Partner"</strong> refers to a business listing and selling food through the Platform.</li>
                <li><strong>"Rider"</strong> refers to an individual delivering orders through the Platform.</li>
                <li><strong>"Content"</strong> refers to text, images, reviews, menus, and other material submitted to the Platform.</li>
              </ul>
            </div>
          </section>

          {/* 2. Eligibility */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">2</span>
              Eligibility
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p>
                You must be at least 13 years old (or the minimum age of digital consent in your jurisdiction) to use Food Genie. By using the Platform, you represent that you have the legal capacity to enter into these Terms. Restaurant Partners and Riders must meet additional eligibility criteria (e.g., valid business license, vehicle documentation) as outlined during onboarding.
              </p>
            </div>
          </section>

          {/* 3. Account Registration */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">3</span>
              Account Registration
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <ul className="list-disc pl-5 space-y-1">
                <li>You must provide accurate, current, and complete information when creating an account.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.</li>
                <li>You must notify us immediately of any unauthorized use of your account.</li>
                <li>We reserve the right to suspend or terminate accounts that provide false information or violate these Terms.</li>
              </ul>
            </div>
          </section>

          {/* 4. Use of the Platform */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">4</span>
              Use of the Platform
            </h2>
            <div className="pl-8 space-y-4 text-[15px] text-[#594139] leading-relaxed">
              <div>
                <h3 className="font-semibold text-[#261814] mb-1">4.1 Customers</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You may browse restaurants, place orders, make payments, and track deliveries in real time.</li>
                  <li>You agree to provide accurate delivery information and be reasonably available to receive your order.</li>
                  <li>Order cancellations are subject to the cancellation policy displayed at checkout.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#261814] mb-1">4.2 Restaurant Partners</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You are responsible for the accuracy of your menu, pricing, food quality, and timely order preparation.</li>
                  <li>You must comply with all applicable food safety and hygiene regulations.</li>
                  <li>Food Genie is not liable for the quality, safety, or legality of food items listed by Restaurant Partners.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#261814] mb-1">4.3 Riders</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You are responsible for timely and safe delivery of orders.</li>
                  <li>You must comply with applicable traffic laws and hold any required licenses or permits.</li>
                  <li>You are an independent contractor, not an employee of Food Genie, unless otherwise agreed in writing.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. AI-Powered Recommendations */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">5</span>
              AI-Powered Recommendations
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed space-y-2">
              <p>
                Food Genie uses AI (powered by OpenAI) to provide personalized food and nutrition recommendations based on your order history and stated preferences. These recommendations are provided for convenience only and do not constitute medical or dietary advice.
              </p>
              <p>
                Users with specific health conditions, allergies, or dietary restrictions should exercise independent judgment and consult a qualified professional where necessary. <strong>Food Genie is not liable for any adverse outcomes resulting from reliance on AI-generated recommendations.</strong>
              </p>
            </div>
          </section>

          {/* 6. Payments and Fees */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">6</span>
              Payments and Fees
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <ul className="list-disc pl-5 space-y-1">
                <li>Prices displayed on the Platform include applicable fees unless stated otherwise; delivery fees, service fees, and taxes may apply and will be shown at checkout.</li>
                <li>Payments are processed through third-party payment gateways. Food Genie does not store your full payment card details.</li>
                <li>Restaurant Partners and Riders will be paid according to the payout schedule and commission structure communicated separately.</li>
                <li>All fees are subject to change with prior notice.</li>
              </ul>
            </div>
          </section>

          {/* 7. Cancellations and Refunds */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">7</span>
              Cancellations and Refunds
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <ul className="list-disc pl-5 space-y-1">
                <li>Orders may be cancelled within the timeframe specified in the app before preparation begins.</li>
                <li>Refunds for incorrect, missing, or unsatisfactory orders will be assessed on a case-by-case basis and issued at Food Genie's discretion.</li>
                <li>Repeated abuse of the cancellation or refund process may result in account suspension.</li>
              </ul>
            </div>
          </section>

          {/* 8. User Conduct */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">8</span>
              User Conduct
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Use the Platform for any unlawful purpose.</li>
                <li>Submit false, misleading, or fraudulent information.</li>
                <li>Harass, threaten, or abuse other users (customers, riders, or restaurant staff).</li>
                <li>Attempt to interfere with, hack, or disrupt the Platform's systems or security.</li>
                <li>Use automated means (bots, scrapers) to access the Platform without authorization.</li>
                <li>Post defamatory, obscene, or infringing Content (e.g., in reviews).</li>
              </ul>
              <p className="mt-2">
                Violation of this section may result in immediate suspension or termination of your account.
              </p>
            </div>
          </section>

          {/* 9. Intellectual Property */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">9</span>
              Intellectual Property
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p>
                All content, trademarks, logos, and software associated with Food Genie are the property of Food Genie or its licensors. You may not copy, modify, distribute, or reverse-engineer any part of the Platform without prior written consent.
              </p>
            </div>
          </section>

          {/* 10. Reviews and User Content */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">10</span>
              Reviews and User Content
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p>
                By submitting reviews, ratings, or other Content, you grant Food Genie a non-exclusive, royalty-free license to use, display, and distribute that Content on the Platform. You are solely responsible for the accuracy and legality of Content you submit.
              </p>
            </div>
          </section>

          {/* 11. Limitation of Liability */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">11</span>
              Limitation of Liability
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p className="mb-2">To the maximum extent permitted by law, Food Genie shall not be liable for:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Delays, errors, or failures in delivery caused by Restaurant Partners, Riders, or third-party services.</li>
                <li>Food quality, allergic reactions, or health outcomes related to orders placed.</li>
                <li>Loss of data, profits, or indirect/consequential damages arising from use of the Platform.</li>
                <li>Any downtime, bugs, or interruptions in service.</li>
              </ul>
              <p className="mt-2 italic">
                The Platform is provided on an "as is" and "as available" basis without warranties of any kind.
              </p>
            </div>
          </section>

          {/* 12. Indemnification */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">12</span>
              Indemnification
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p>
                You agree to indemnify and hold harmless Food Genie, its affiliates, and staff from any claims, damages, or expenses arising from your violation of these Terms or misuse of the Platform.
              </p>
            </div>
          </section>

          {/* 13. Termination */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">13</span>
              Termination
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p>
                We reserve the right to suspend or terminate your access to the Platform at any time, with or without notice, for conduct that violates these Terms or is otherwise harmful to other users or the Platform.
              </p>
            </div>
          </section>

          {/* 14. Third-Party Services */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">14</span>
              Third-Party Services
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p>
                The Platform integrates with third-party services including Google Maps, Firebase, OpenAI, and payment processors. Your use of these integrated services may also be subject to their respective terms and policies.
              </p>
            </div>
          </section>

          {/* 15. Changes to These Terms */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">15</span>
              Changes to These Terms
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p>
                We may revise these Terms from time to time. Continued use of the Platform after changes take effect constitutes acceptance of the revised Terms. Material changes will be communicated via the app or email.
              </p>
            </div>
          </section>

          {/* 16. Governing Law */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">16</span>
              Governing Law
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the <strong>Islamic Republic of Pakistan</strong>, without regard to conflict of law principles.
              </p>
            </div>
          </section>

          {/* 17. Contact Us */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">17</span>
              Contact Us
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p>
                For questions regarding these Terms, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-[#fff1ed] rounded-xl border border-[#fde3db] inline-block space-y-1">
                <p className="font-semibold text-[#261814]">Food Genie Headquarters</p>
                <p>Email: <a href="mailto:ahmadmashhood.bcs018@gmail.com" className="text-[#ab3500] font-bold hover:underline">ahmadmashhood.bcs018@gmail.com</a></p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
