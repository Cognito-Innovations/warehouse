import { Box, Container, Typography, Link as MuiLink, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, md: 3 } }}>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Last updated: January 9, 2026
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          INTRODUCTION
        </Typography>
        <Typography variant="body1" paragraph>
          Palakart ("we", "us", or "our") operates the Palakart website (the "Service").
        </Typography>
        <Typography variant="body1" paragraph>
          This page explains how we collect, use, disclose, and protect personal data when you use our Service, and the choices you have regarding that data.
        </Typography>
        <Typography variant="body1" paragraph>
          Use of the Service is subject to this Privacy Policy.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          WHO WE ARE
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Controller: Palakart</Typography>
          <Typography component="li" variant="body1">
            Registered address: Building No./Flat No. 4/224, Perumagoundampatti, Moolakkadai, Elampillai Post, Salem Taluk, Ilampillai, Salem, Tamil Nadu 637502
          </Typography>
          <Typography component="li" variant="body1">
            Privacy contact: <MuiLink href="mailto:palakart@gmail.com">palakart@gmail.com</MuiLink>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          INFORMATION COLLECTION AND USE
        </Typography>
        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
          PURPOSES & LEGAL BASES (EU/UK)
        </Typography>
        <Typography variant="body1" paragraph>
          We collect several different types of information for various purposes to provide and improve our Service to you.
        </Typography>

        <TableContainer component={Paper} sx={{ my: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Purpose</strong></TableCell>
                <TableCell><strong>Personal Data Involved</strong></TableCell>
                <TableCell><strong>Legal Basis</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>To provide and maintain the Service (e.g., account management, order processing)</TableCell>
                <TableCell>Email, name, phone, address</TableCell>
                <TableCell>Performance of a contract</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>To improve and personalize the Service</TableCell>
                <TableCell>Usage data, device information</TableCell>
                <TableCell>Legitimate interests</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Marketing communications (with consent)</TableCell>
                <TableCell>Email, preferences</TableCell>
                <TableCell>Consent</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Security, fraud prevention</TableCell>
                <TableCell>IP address, device ID, usage logs</TableCell>
                <TableCell>Legitimate interests / Legal obligation</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Legal compliance</TableCell>
                <TableCell>Order and payment data</TableCell>
                <TableCell>Legal obligation</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
          Types of Data Collected
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
          Personal Data
        </Typography>
        <Typography variant="body1" paragraph>
          While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Email address</Typography>
          <Typography component="li" variant="body1">First name and last name</Typography>
          <Typography component="li" variant="body1">Phone number</Typography>
          <Typography component="li" variant="body1">Address, State, Province, ZIP/Postal code, City</Typography>
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Usage Data
        </Typography>
        <Typography variant="body1" paragraph>
          We may also collect information that your browser sends whenever you visit our Service or when you access the Service by or through a device ("Usage Data"). Usage Data may include information such as your device's Internet Protocol (IP) address, browser type and version, device identifiers, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Cookies and Similar Technologies
        </Typography>
        <Typography variant="body1" paragraph>
          We use cookies, pixels and similar technologies on our website. Essential cookies are required to operate the Service. We may also use non-essential cookies for analytics, personalization, or advertising purposes in accordance with applicable law. You can manage cookies via your browser settings.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Sources of Personal Data
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">You: Information you provide (e.g., forms, account, support).</Typography>
          <Typography component="li" variant="body1">Device & browser: Technical and usage data (e.g., IP address, device identifiers, logs). Non-essential cookies/SDKs are used only with consent where required.</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          USE OF DATA
        </Typography>
        <Typography variant="body1" paragraph>
          Palakart uses the collected data for various purposes:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">To provide and maintain the Service</Typography>
          <Typography component="li" variant="body1">To notify you about changes to our Service</Typography>
          <Typography component="li" variant="body1">To allow you to participate in interactive features of our Service when you choose to do so</Typography>
          <Typography component="li" variant="body1">To provide customer care and support</Typography>
          <Typography component="li" variant="body1">To provide analysis or valuable information so that we can improve the Service</Typography>
          <Typography component="li" variant="body1">To monitor the usage of the Service</Typography>
          <Typography component="li" variant="body1">To detect, prevent and address technical issues</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          RETENTION
        </Typography>
        <Typography variant="body1" paragraph>
          We keep personal data only as long as necessary for the purposes described or as required by law. Where specific periods are not feasible, we apply clear criteria (e.g., account lifetime + a defined period, statutory limitation periods). Cookies and SDKs have varying retention periods depending on their purpose.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          DELETE OR UPDATE YOUR DATA
        </Typography>
        <Typography variant="body1" paragraph>
          Where available, you may update certain information within your account settings. You may also request that we delete Personal Data we hold about you, subject to legal exceptions (for example, if we must retain data to comply with law).
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          YOUR CHOICES
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Opt out of marketing emails via the unsubscribe link or by contacting us.</Typography>
          <Typography component="li" variant="body1">Manage cookies through your browser settings.</Typography>
          <Typography component="li" variant="body1">California residents: use our Do Not Sell or Share and Limit SPI options where applicable.</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          INTERNATIONAL TRANSFERS
        </Typography>
        <Typography variant="body1" paragraph>
          Personal data may be transferred to and processed in countries outside the EEA or UK. Where such transfers occur, we use appropriate safeguards such as the EU Standard Contractual Clauses (Commission Decision (EU) 2021/914) and/or the UK International Data Transfer Agreement/Addendum, and we carry out transfer risk assessments with supplementary measures where appropriate.
        </Typography>
        <Typography variant="body1" paragraph>
          Our hosting and service providers may be located in various jurisdictions. We ensure that all data processors maintain adequate data protection standards.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Service Providers and Affiliates
        </Typography>
        <Typography variant="body1" paragraph>
          We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used. We may also share information with our affiliates, in which case we require them to honor this Privacy Policy. These third parties have access to Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
        </Typography>
        <Typography variant="body1" paragraph>
          Typical categories of recipients include cloud hosting, analytics, advertising/remarketing partners (where enabled), payment processors, customer support platforms, and security/fraud-prevention vendors.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Business Transfers
        </Typography>
        <Typography variant="body1" paragraph>
          We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Legal Requirements
        </Typography>
        <Typography variant="body1" paragraph>
          Palakart may disclose your Personal Data in the good faith belief that such action is necessary to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Comply with a legal obligation</Typography>
          <Typography component="li" variant="body1">Protect and defend the rights or property of Palakart</Typography>
          <Typography component="li" variant="body1">Prevent or investigate possible wrongdoing in connection with the Service</Typography>
          <Typography component="li" variant="body1">Protect the personal safety of users of the Service or the public</Typography>
          <Typography component="li" variant="body1">Protect against legal liability</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          SECURITY OF DATA
        </Typography>
        <Typography variant="body1" paragraph>
          We implement appropriate technical and organizational measures to protect your Personal Data. While no method of transmission or storage is 100% secure, we continuously improve our safeguards.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          AUTOMATED DECISION-MAKING
        </Typography>
        <Typography variant="body1" paragraph>
          We do not make decisions based solely on automated processing that produce legal or similarly significant effects. If this changes, we will provide required information about the logic involved and your rights.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          LINKS TO OTHER SITES
        </Typography>
        <Typography variant="body1" paragraph>
          Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
        </Typography>
        <Typography variant="body1" paragraph>
          We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          CHILDREN'S PRIVACY
        </Typography>
        <Typography variant="body1" paragraph>
          Our Services are not directed to children. For EU/UK users, where we offer information society services and rely on consent, we obtain parental consent for users below the applicable age (EU up to 16; UK 13). If you believe a child has provided data contrary to this policy, contact us to request deletion.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          CHANGES TO THIS PRIVACY POLICY
        </Typography>
        <Typography variant="body1" paragraph>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </Typography>
        <Typography variant="body1" paragraph>
          We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.
        </Typography>
        <Typography variant="body1" paragraph>
          You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          CONTACT US
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">
            Privacy requests: <MuiLink href="mailto:palakart@gmail.com">palakart@gmail.com</MuiLink>
          </Typography>
          <Typography component="li" variant="body1">
            By email: <MuiLink href="mailto:palakart@gmail.com">palakart@gmail.com</MuiLink>
          </Typography>
          <Typography component="li" variant="body1">By phone number: +919994126566</Typography>
        </Box>
      </Box>
    </Container>
  );
}