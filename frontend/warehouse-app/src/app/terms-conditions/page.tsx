import { Box, Container, Typography, Link as MuiLink } from "@mui/material";

export default function TermsConditionsPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, md: 3 } }}>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Effective Date: January 9, 2026
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Service: Palakart website
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Operator: Palakart
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Introduction
        </Typography>
        <Typography variant="body1" paragraph>
          These Terms and Conditions govern your use of palakart website, operated by Palakart.
        </Typography>
        <Typography variant="body1" paragraph>
          By accessing or using our services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
        </Typography>
        <Typography variant="body1" paragraph>
          Last updated: January 9, 2026
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Acceptance of Terms
        </Typography>
        <Typography variant="body1" paragraph>
          By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </Typography>
        <Typography variant="body1" paragraph>
          These Terms and Conditions constitute a legally binding agreement between you and us. Your continued use of the services will be deemed acceptance of these terms.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Age Requirement
        </Typography>
        <Typography variant="body1" paragraph>
          You must be at least 13 years old to use our services. In certain countries (such as EU Member States), the minimum age may be up to 16 years depending on local digital consent laws.
        </Typography>
        <Typography variant="body1" paragraph>
          If you are under the applicable minimum age, you must have verifiable parental or guardian consent to use the services. We reserve the right to request proof of parental consent.
        </Typography>
        <Typography variant="body1" paragraph>
          By using our services, you represent that you meet these age requirements or have obtained proper parental consent.
        </Typography>
        <Typography variant="body1" paragraph>
          If we learn that we have collected personal information from someone under the minimum age without parental consent, we will take steps to delete that information as required by applicable law (including COPPA in the United States).
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Use of Service
        </Typography>
        <Typography variant="body1" paragraph>
          You may use palakart website only for lawful purposes and in accordance with these Terms. You agree not to use our services:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">In any way that violates any applicable national or international law or regulation</Typography>
          <Typography component="li" variant="body1">For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way</Typography>
          <Typography component="li" variant="body1">To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</Typography>
          <Typography component="li" variant="body1">To impersonate or attempt to impersonate us, our employees, another user, or any other person or entity</Typography>
          <Typography component="li" variant="body1">In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</Typography>
          <Typography component="li" variant="body1">To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the services</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Intellectual Property Rights
        </Typography>
        <Typography variant="body1" paragraph>
          The services and their original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Palakart.
        </Typography>
        <Typography variant="body1" paragraph>
          Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent. All other trademarks not owned by us that appear on the services are the property of their respective owners.
        </Typography>
        <Typography variant="body1" paragraph>
          You may not modify, reproduce, distribute, create derivative works or adaptations of, publicly display or in any way exploit any of the content in whole or in part except as expressly authorized by us.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Third-Party Services and Links
        </Typography>
        <Typography variant="body1" paragraph>
          Our services may contain links to third-party websites, applications, or services that are not owned or controlled by us. We may also integrate or embed third-party content, services, or functionality (such as payment processors, analytics, maps, social media widgets, or advertising networks).
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          No Control or Endorsement
        </Typography>
        <Typography variant="body1" paragraph>
          We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites, services, or resources. We do not endorse or make any representations about third-party websites or services.
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Third-Party Terms
        </Typography>
        <Typography variant="body1" paragraph>
          Your use of third-party services is governed by their respective terms of service and privacy policies. You should review the terms and policies of any third-party service before using it.
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Affiliate Relationships
        </Typography>
        <Typography variant="body1" paragraph>
          We may participate in affiliate programs and may earn commissions or referral fees from purchases or sign-ups through affiliate links. These relationships do not affect our editorial independence or your purchase price.
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Embedded Services
        </Typography>
        <Typography variant="body1" paragraph>
          Third-party embeds (such as YouTube videos, Google Maps, payment processors, or social media content) may collect data about you according to their own privacy policies. We are not responsible for data collection by embedded third-party services.
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          External Links
        </Typography>
        <Typography variant="body1" paragraph>
          When you click on links to external websites, you will leave our services and be subject to the terms and policies of those external websites. We are not responsible for the content or practices of external websites.
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Your Responsibility
        </Typography>
        <Typography variant="body1" paragraph>
          You acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with your use of or reliance on any third-party content, goods, or services available through such third-party websites or services.
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Removal of Links
        </Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to remove any third-party links or integrations at any time without notice.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Prohibited Uses
        </Typography>
        <Typography variant="body1" paragraph>
          In addition to other terms as set forth in these Terms and Conditions, you are prohibited from using our services:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">For any unlawful purpose or to solicit others to perform or participate in any unlawful acts</Typography>
          <Typography component="li" variant="body1">To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</Typography>
          <Typography component="li" variant="body1">To infringe upon or violate our intellectual property rights or the intellectual property rights of others</Typography>
          <Typography component="li" variant="body1">To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability</Typography>
          <Typography component="li" variant="body1">To submit false or misleading information</Typography>
          <Typography component="li" variant="body1">To upload or transmit viruses or any other type of malicious code</Typography>
          <Typography component="li" variant="body1">To collect or track the personal information of others</Typography>
          <Typography component="li" variant="body1">To spam, phish, pharm, pretext, spider, crawl, or scrape</Typography>
          <Typography component="li" variant="body1">For any obscene or immoral purpose</Typography>
          <Typography component="li" variant="body1">To interfere with or circumvent the security features of our services or any related website, other websites, or the Internet</Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          We reserve the right to terminate your use of the services for violating any of the prohibited uses.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Termination
        </Typography>
        <Typography variant="body1" paragraph>
          We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms and Conditions.
        </Typography>
        <Typography variant="body1" paragraph>
          Upon termination, your right to use the services will immediately cease. If you wish to terminate your account, you may simply discontinue using the services.
        </Typography>
        <Typography variant="body1" paragraph>
          All provisions of these Terms and Conditions which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Warranty Disclaimer
        </Typography>
        <Typography variant="body1" paragraph>
          The services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied.
        </Typography>
        <Typography variant="body1" paragraph>
          Palakart disclaims all warranties, including but not limited to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Implied warranties of merchantability</Typography>
          <Typography component="li" variant="body1">Fitness for a particular purpose</Typography>
          <Typography component="li" variant="body1">Non-infringement</Typography>
          <Typography component="li" variant="body1">Quiet enjoyment</Typography>
          <Typography component="li" variant="body1">Accuracy of data</Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          We do not warrant that the services will be uninterrupted, timely, secure, or error-free. We do not warrant that the results obtained from using the services will be accurate or reliable.
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Consumer Rights
        </Typography>
        <Typography variant="body1" paragraph>
          Nothing in these Terms affects your statutory rights as a consumer. Where required by mandatory consumer protection law, the above disclaimers do not apply, and you retain all rights provided by such laws.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph>
          To the fullest extent permitted by law, our aggregate liability arising out of or related to the services is capped at the greater of 100 USD or the fees you paid to us in the 12 months preceding the claim.
        </Typography>
        <Typography variant="body1" paragraph>
          In no event shall Palakart, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Loss of profits, data, use, goodwill, or other intangible losses</Typography>
          <Typography component="li" variant="body1">Unauthorized access, use or alteration of your transmissions or content</Typography>
          <Typography component="li" variant="body1">Statements or conduct of any third party on the services</Typography>
          <Typography component="li" variant="body1">Any other matter relating to the services</Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          Whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
        </Typography>
        <Typography variant="body1" paragraph>
          Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for incidental or consequential damages. Accordingly, some of the limitations above may not apply to you.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Indemnification
        </Typography>
        <Typography variant="body1" paragraph>
          You agree to defend, indemnify and hold harmless Palakart and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Your use and access of the services</Typography>
          <Typography component="li" variant="body1">Your violation of any term of these Terms and Conditions</Typography>
          <Typography component="li" variant="body1">Your violation of any third party right, including without limitation any copyright, property, or privacy right</Typography>
          <Typography component="li" variant="body1">Any claim that your Content caused damage to a third party</Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          This defense and indemnification obligation will survive these Terms and Conditions and your use of the services.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Force Majeure
        </Typography>
        <Typography variant="body1" paragraph>
          Palakart shall not be liable for any delay or failure to perform resulting from causes outside our reasonable control, including but not limited to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Acts of God, natural disasters, epidemics, or pandemics</Typography>
          <Typography component="li" variant="body1">War, terrorism, riots, or civil unrest</Typography>
          <Typography component="li" variant="body1">Government actions, laws, or regulations</Typography>
          <Typography component="li" variant="body1">Labor disputes or strikes</Typography>
          <Typography component="li" variant="body1">Utility failures or telecommunications outages</Typography>
          <Typography component="li" variant="body1">Internet service provider failures or delays</Typography>
          <Typography component="li" variant="body1">Cyber attacks or data breaches affecting third-party services</Typography>
          <Typography component="li" variant="body1">Any other event beyond our reasonable control</Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          In such events, our obligations under these Terms will be suspended for the duration of the force majeure event. We will use reasonable efforts to minimize the impact and resume normal operations as soon as possible.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Governing Law
        </Typography>
        <Typography variant="body1" paragraph>
          These Terms and Conditions shall be governed and construed in accordance with the laws of IN, without regard to its conflict of law provisions.
        </Typography>
        <Typography variant="body1" paragraph>
          Our failure to enforce any right or provision of these Terms and Conditions will not be considered a waiver of those rights. If any provision of these Terms and Conditions is held to be invalid or unenforceable by a court, the remaining provisions of these Terms and Conditions will remain in effect.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Dispute Resolution
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any concern or dispute about our services, you agree to first try to resolve the dispute informally by contacting us.
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Binding Arbitration
        </Typography>
        <Typography variant="body1" paragraph>
          Any disputes arising out of or relating to these Terms and Conditions or the services that cannot be resolved informally shall be resolved through binding arbitration in accordance with the applicable arbitration rules, except where prohibited by law.
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Waiver of Rights
        </Typography>
        <Typography variant="body1" paragraph>
          You and we each waive the right to a trial by jury. You and we each waive the right to participate in a class action or other class proceeding.
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Exceptions
        </Typography>
        <Typography variant="body1" paragraph>
          Either party may bring a claim in small claims court for disputes that qualify. Additionally, either party may seek injunctive or equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation or violation of intellectual property rights.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Changes to Terms and Conditions
        </Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to modify or replace these Terms and Conditions at any time.
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Notice of Changes
        </Typography>
        <Typography variant="body1" paragraph>
          For material changes (such as changes to pricing, payment terms, cancellation rights, or dispute resolution), we will provide advance notice by:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Email to the address associated with your account</Typography>
          <Typography component="li" variant="body1">Prominent notice on our services</Typography>
          <Typography component="li" variant="body1">In-app notification (if applicable)</Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          We will provide at least 30 days' notice for material changes, or such longer period as required by applicable law.
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Acceptance of Changes
        </Typography>
        <Typography variant="body1" paragraph>
          By continuing to access or use our services after the changes take effect, you agree to be bound by the revised terms. If you do not agree to the new terms, you must stop using the services and may cancel your account in accordance with these Terms.
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Consent Requirement
        </Typography>
        <Typography variant="body1" paragraph>
          Where required by law (such as for price increases in ongoing subscriptions), we will request your explicit consent before applying the changes. You will have the right to cancel before the changes take effect without penalty.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          User Accounts
        </Typography>
        <Typography variant="body1" paragraph>
          Our Service allows users to create accounts. Account creation is optional but enables enhanced features such as order tracking, saved addresses, and personalized recommendations.
        </Typography>
        <Typography variant="body1" paragraph>
          If you create an account, you agree to provide accurate, current, and complete information during registration and to update such information as necessary to keep it accurate. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          User Generated Content
        </Typography>
        <Typography variant="body1" paragraph>
          The Palakart Service does not permit users to create, upload, post, transmit, or otherwise make available any user-generated content, including but not limited to text, images, videos, reviews, comments, or other materials.
        </Typography>
        <Typography variant="body1" paragraph>
          All content displayed on or through the Service is provided by Palakart, its licensors, or authorized partners and remains the exclusive property of Palakart or such third parties.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Purchases and In-App Purchases
        </Typography>
        <Typography variant="body1" paragraph>
          Our Service enables users to purchase goods, items, or services. All purchases are subject to these Terms and Conditions, any product-specific terms, and the checkout process.
        </Typography>
        <Typography variant="body1" paragraph>
          We may offer in-app purchases for certain products, features, or services. By making a purchase, you agree to pay the stated price, including applicable taxes and fees, using the payment methods provided.
        </Typography>
        <Typography variant="body1" paragraph>
          All transactions are processed securely through third-party payment processors. Title and risk of loss for physical goods pass to you upon delivery.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Subscription Plans
        </Typography>
        <Typography variant="body1" paragraph>
          Palakart does not currently offer any subscription plans or recurring billing services.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions about these Terms and Conditions, please contact us:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">
            Email: <MuiLink href="mailto: team.palakart@gmail.com"> team.palakart@gmail.com</MuiLink>
          </Typography>
          <Typography component="li" variant="body1">Phone: +919994126566</Typography>
        </Box>
      </Box>
    </Container>
  );
}