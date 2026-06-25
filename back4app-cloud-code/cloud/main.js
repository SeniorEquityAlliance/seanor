async function saveContactSubmission(payload) {
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "requesterType",
    "subject",
    "message"
  ];

  for (const field of requiredFields) {
    if (!payload[field] || String(payload[field]).trim().length === 0) {
      throw new Parse.Error(Parse.Error.VALIDATION_ERROR, `${field} is required.`);
    }
  }

  if (payload.consent !== true) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, "Consent is required.");
  }

  const ContactSubmission = Parse.Object.extend("ContactSubmission");
  const submission = new ContactSubmission();

  submission.set("firstName", String(payload.firstName).trim());
  submission.set("lastName", String(payload.lastName).trim());
  submission.set("email", String(payload.email).trim().toLowerCase());
  submission.set("phone", String(payload.phone).trim());
  submission.set("requesterType", String(payload.requesterType).trim());
  submission.set("subject", String(payload.subject).trim());
  submission.set("message", String(payload.message).trim());
  submission.set("consent", true);
  submission.set("sourcePage", String(payload.sourcePage || "/").trim());

  await submission.save(null, { useMasterKey: true });

  return {
    ok: true,
    objectId: submission.id
  };
}

Parse.Cloud.define("submitContactSubmission", async (request) => {
  return saveContactSubmission(request.params || {});
});

module.exports = {
  saveContactSubmission
};
