import { Box, Container, Typography } from "@mui/material";

export default function ReturnsPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, md: 3 } }}>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Last updated: January 9, 2026
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" paragraph>
          Thank you for your purchase. We hope you are happy with your purchase. However, if you are not completely satisfied with your purchase for any reason, you may return it to us for a full refund, store credit, or an exchange. Please see below for more information on our return policy.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          RETURNS
        </Typography>
        <Typography variant="body1" paragraph>
          All returns must be postmarked within 30 days of the purchase date. All returned items must be in new and unused condition, with all original tags and labels attached.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          RETURN PROCESS
        </Typography>
        <Typography variant="body1" paragraph>
          To return an item, please email customer service at  team.palakart@gmail.com to obtain a Return Merchandise Authorization (RMA) number. After receiving a RMA number, place the item securely in its original packaging and include your proof of purchase, and mail your return to the following address:
        </Typography>
        <Typography variant="body1" paragraph sx={{ pl: 4 }}>
          Palakart<br />
          Attn: Returns<br />
          Building No./Flat No. 4/224, Perumagoundampatti, Moolakkadai, Elampillai Post, Salem Taluk, Ilampillai<br />
          Salem, Tamil Nadu 637502<br />
          India
        </Typography>
        <Typography variant="body1" paragraph>
          Please note, you will be responsible for all return shipping charges. We strongly recommend that you use a trackable method to mail your return.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          REFUNDS
        </Typography>
        <Typography variant="body1" paragraph>
          After receiving your return and inspecting the condition of your item, we will process your return or exchange. Please allow at least 7 days from the receipt of your item to process your return or exchange. Refunds may take 1-2 billing cycles to appear on your credit card statement, depending on your credit card company. We will notify you by email when your return has been processed.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          EXCEPTIONS
        </Typography>
        <Typography variant="body1" paragraph>
          The following items cannot be returned or exchanged:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">Perishable goods</Typography>
          <Typography component="li" variant="body1">Personalized items</Typography>
          <Typography component="li" variant="body1">Intimate or sanitary goods</Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          For defective or damaged products, please contact us at the contact details below to arrange a refund or exchange.
        </Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Please Note
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">A $5 restocking fee will be charged for all returns in excess of $50.</Typography>
          <Typography component="li" variant="body1">Sale items are FINAL SALE and cannot be returned.</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          QUESTIONS
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions concerning our return policy, please contact us at:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">+919994126566</Typography>
          <Typography component="li" variant="body1"> team.palakart@gmail.com</Typography>
        </Box>
      </Box>
    </Container>
  );
}