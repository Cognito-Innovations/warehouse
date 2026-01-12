import { Box, Container, Typography } from "@mui/material";

export default function SecurityPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, md: 3 } }}>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Introduction
        </Typography>
        <Typography variant="body1" paragraph>
          Information security is a holistic discipline, meaning that its application, or lack thereof, affects all facets of an organization or enterprise. The goal of the Palakart Information Security Program is to protect the Confidentiality, Integrity, and Availability of the data employed within the organization while providing value to the way we conduct business. Protection of the Confidentiality, Integrity, and Availability are basic principles of information security, and can be defined as:
        </Typography>
        <Box component="ol" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1"><strong>Confidentiality</strong> – Ensuring that information is accessible only to those entities that are authorized to have access, many times enforced by the classic “need to know” principle.</Typography>
          <Typography component="li" variant="body1"><strong>Integrity</strong> – Protecting the accuracy and completeness of information and the methods that are used to process and manage it.</Typography>
          <Typography component="li" variant="body1"><strong>Availability</strong> – Ensuring that information assets (information, systems, facilities, networks, and computers) are accessible and usable when needed by an authorized entity.</Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          Palakart has recognized that our business information is a critical asset and as such our ability to manage, control, and protect this asset will have a direct and significant impact on our future success.
        </Typography>
        <Typography variant="body1" paragraph>
          This document establishes the framework from which other information security policies may be developed to ensure that the enterprise can efficiently and effectively manage, control and protect its business information assets and those information assets entrusted to Palakart by its stakeholders, partners, customers and other third parties.
        </Typography>
        <Typography variant="body1" paragraph>
          The Information Security Program is built around the information contained within this policy and its supporting policies.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Purpose
        </Typography>
        <Typography variant="body1" paragraph>
          The purpose of the Information Security Policy is to describe the actions and behaviors required to ensure that due care is taken to avoid inappropriate risks to Palakart, its business partners, and its stakeholders.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Audience
        </Typography>
        <Typography variant="body1" paragraph>
          The Information Security Policy applies equally to any individual, entity, or process that interacts with any Palakart Information Resource.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Responsibilities
        </Typography>
        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
          Executive Management
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Ensure that an appropriate risk-based Information Security Program is implemented to protect the confidentiality, integrity, and availability of all Information Resources collected or maintained by or on behalf of Palakart.</Typography>
          <Typography component="li" variant="body1">Ensure that information security processes are integrated with strategic and operational planning processes to secure the organization’s mission.</Typography>
          <Typography component="li" variant="body1">Ensure adequate information security financial and personnel resources are included in the budgeting and/or financial planning process.</Typography>
          <Typography component="li" variant="body1">Ensure that the Information Security Team is given the necessary authority to secure the Information Resources under their control within the scope of the Information Security Program.</Typography>
          <Typography component="li" variant="body1">Designate an Information Security Officer and delegate authority to that individual to ensure compliance with applicable information security requirements.</Typography>
          <Typography component="li" variant="body1">Ensure that the Information Security Officer, in coordination with the Information Security Committee, reports annually to Executive Management on the effectiveness of the Information Security Program.</Typography>
        </Box>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
          Information Security Officer
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Chair the Information Security Committee and provide updates on the status of the Information Security Program to Executive Management.</Typography>
          <Typography component="li" variant="body1">Manage compliance with all relevant statutory, regulatory, and contractual requirements.</Typography>
          <Typography component="li" variant="body1">Participate in security related forums, associations and special interest groups.</Typography>
          <Typography component="li" variant="body1">Assess risks to the confidentiality, integrity, and availability of all Information Resources collected or maintained by or on behalf of Palakart.</Typography>
          <Typography component="li" variant="body1">Facilitate development and adoption of supporting policies, procedures, standards, and guidelines for providing adequate information security and continuity of operations.</Typography>
          <Typography component="li" variant="body1">Ensure that all personnel are trained to support compliance with information security policies, processes, standards, and guidelines. Train and oversee personnel with significant responsibilities for information security with respect to such responsibilities.</Typography>
          <Typography component="li" variant="body1">Ensure that appropriate information security awareness training is provided to company personnel, including contractors.</Typography>
          <Typography component="li" variant="body1">Implement and maintain a process for planning, implementing, evaluating, and documenting remedial action to address any deficiencies in the information security policies, procedures, and practices.</Typography>
          <Typography component="li" variant="body1">Develop and implement procedures for testing and evaluating the effectiveness of the Information Security Program in accordance with stated objectives.</Typography>
          <Typography component="li" variant="body1">Develop and implement a process for evaluating risks related to vendors and managing vendor relationships.</Typography>
          <Typography component="li" variant="body1">Report annually, in coordination with the Information Security Committee, to Executive Management on the effectiveness of the Information Security Program, including progress of remedial actions.</Typography>
          <Typography component="li" variant="body1">Maintain an adequate level of current knowledge and proficiency in information security through annual Continuing Professional Education (CPE) credits directly related to information security.</Typography>
        </Box>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
          Information Security Committee
        </Typography>
        <Typography variant="body1" paragraph>
          In accordance with the Information Security Committee Charter:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Ensure compliance with applicable information security requirements.</Typography>
          <Typography component="li" variant="body1">Formulate, review and recommend information security policies.</Typography>
          <Typography component="li" variant="body1">Approve supporting procedures, standards, and guidelines related to information security.</Typography>
          <Typography component="li" variant="body1">Assess the adequacy and effectiveness of the information security policies and coordinate the implementation of information security controls.</Typography>
          <Typography component="li" variant="body1">Review and manage the information security policy waiver request process.</Typography>
          <Typography component="li" variant="body1">Identify and recommend how to handle non-compliance.</Typography>
          <Typography component="li" variant="body1">Provide clear direction and visible management support for information security initiatives.</Typography>
          <Typography component="li" variant="body1">Promote information security education, training, and awareness throughout Palakart, and initiate plans and programs to maintain information security awareness.</Typography>
          <Typography component="li" variant="body1">Educate the team and staff on ongoing legal, regulatory and compliance changes as well as industry news and trends.</Typography>
          <Typography component="li" variant="body1">Identify significant threat changes and vulnerabilities.</Typography>
          <Typography component="li" variant="body1">Evaluate information received from monitoring processes.</Typography>
          <Typography component="li" variant="body1">Review information security incident information and recommend follow-up actions.</Typography>
          <Typography component="li" variant="body1">Report annually, in coordination with the Information Security Officer, to Executive Management on the effectiveness of the Information Security Program, including progress of remedial actions.</Typography>
        </Box>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
          All Employees, Contractors, and Other Third-Party Personnel
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Understand their responsibilities for complying with the Information Security Program.</Typography>
          <Typography component="li" variant="body1">Formally sign off and agree to abide by all applicable policies, standards, and guidelines that have been established.</Typography>
          <Typography component="li" variant="body1">Use Palakart Information Resources in compliance with all Information Security Policies.</Typography>
          <Typography component="li" variant="body1">Protect personal, private, sensitive information from unauthorized use or disclosure.</Typography>
          <Typography component="li" variant="body1">Report suspected information security incidents or weaknesses to the appropriate manager and Information Security Officer.</Typography>
          <Typography component="li" variant="body1">Seek guidance from the Information Security Team for questions or issues related to information security.</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Policy
        </Typography>
        <Typography variant="body1" paragraph>
          Palakart maintains and communicates an Information Security Program consisting of topic-specific policies, standards, procedures and guidelines that:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Serve to protect the Confidentiality, Integrity, and Availability of the Information Resources maintained within the organization using administrative, physical and technical controls.</Typography>
          <Typography component="li" variant="body1">Provide value to the way we conduct business and support institutional objectives.</Typography>
          <Typography component="li" variant="body1">Comply with all regulatory and legal requirements, including: (adjust as appropriate)</Typography>
          <Box component="ul" sx={{ pl: 4 }}>
            <Typography component="li" variant="body1">HIPAA Security Rule,</Typography>
            <Typography component="li" variant="body1">State breach notification laws,</Typography>
            <Typography component="li" variant="body1">PCI Data Security Standard,</Typography>
            <Typography component="li" variant="body1">Information Security best practices, including ISO 27002 and NIST CSF,</Typography>
            <Typography component="li" variant="body1">Contractual agreements,</Typography>
            <Typography component="li" variant="body1">All other applicable federal and state laws or regulations.</Typography>
          </Box>
        </Box>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          The information security program is reviewed no less than annually or upon significant changes to the information security environment.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Definitions
        </Typography>
        <Typography variant="body1" paragraph>
          See Appendix A: Definitions
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          References
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">ISO 27002: 5, 6, 8</Typography>
          <Typography component="li" variant="body1">NIST CSF: ID.AM, GV.OC, PR.AT, ID.IM</Typography>
          <Typography component="li" variant="body1">Information Security Committee Charter</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Waivers
        </Typography>
        <Typography variant="body1" paragraph>
          Waivers from certain policy provisions may be sought following the Palakart Waiver Process.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Enforcement
        </Typography>
        <Typography variant="body1" paragraph>
          Personnel found to have violated this policy may be subject to disciplinary action, up to and including termination of employment, and related civil or criminal penalties.
        </Typography>
        <Typography variant="body1" paragraph>
          Any vendor, consultant, or contractor found to have violated this policy may be subject to sanctions up to and including removal of access rights, termination of contract(s), and related civil or criminal penalties.
        </Typography>
      </Box>
    </Container>
  );
}