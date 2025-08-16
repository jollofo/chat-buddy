"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { LeadSchema } from "@/lib/schemas";
import { getCustomerSDK } from "@/lib/livechat";

const Schema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid").optional(),
  phone: Yup.string().optional(),
  gdpr: Yup.bool().oneOf([true], "Consent required"),
});

export default function PreChatForm({ onReady }: { onReady: () => void }) {
  return (
    <Formik
      initialValues={{ name: "", email: "", phone: "", gdpr: false }}
      validationSchema={Schema}
      onSubmit={async (values) => {
        const parsed = LeadSchema.parse(values);
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
        });
        const sdk = getCustomerSDK();
        await sdk.updateCustomer({
          name: parsed.name,
          email: parsed.email || undefined,
        });
        await sdk.startChat(); // or pass { chat: {...} } options if needed
        onReady();
        onReady();
      }}
    >
      {({ errors }) => (
        <Form className="max-w-md space-y-3">
          <div>
            <label>Name</label>
            <Field name="name" className="w-full border p-2 rounded" />
            {errors.name && (
              <p className="text-red-600 text-sm">{String(errors.name)}</p>
            )}
          </div>
          <div>
            <label>Email</label>
            <Field
              name="email"
              type="email"
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Phone</label>
            <Field name="phone" className="w-full border p-2 rounded" />
          </div>
          <label className="inline-flex items-center gap-2">
            <Field type="checkbox" name="gdpr" />
            <span>
              I consent to data processing and agree to the privacy policy.
            </span>
          </label>
          {errors.gdpr && (
            <p className="text-red-600 text-sm">{String(errors.gdpr)}</p>
          )}
          <button
            type="submit"
            className="px-4 py-2 rounded bg-black text-white"
          >
            Start chat
          </button>
        </Form>
      )}
    </Formik>
  );
}
