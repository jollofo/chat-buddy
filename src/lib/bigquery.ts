import 'server-only';
import { BigQuery } from "@google-cloud/bigquery";

const client = new BigQuery({ projectId: process.env.GCP_PROJECT_ID });
const dataset = process.env.BQ_DATASET!;

export async function insertBQ(table: string, rows: any[]) {
  const tableRef = client.dataset(dataset).table(table);
  try {
    await tableRef.insert(rows, { ignoreUnknownValues: true, raw: true });
    return { success: true };
  } catch (e: any) {
    if (e?.name === 'PartialFailureError' && e.errors?.length) {
      throw new Error('BigQuery partial failure: ' + JSON.stringify(e.errors));
    }
    throw e;
  }
}

export async function upsertLead(lead: any) {
  const table = process.env.BQ_LEADS_TABLE!;
  // Use MERGE via query for idempotency (email+phone as key)
  const keyEmail = lead.email || null;
  const keyPhone = lead.phone || null;
  const query = `
    MERGE \`${client.projectId}.${dataset}.${table}\` T
    USING (SELECT @name name, @email email, @phone phone, @gdpr gdpr, @utm utm, CURRENT_TIMESTAMP() ts) S
    ON (COALESCE(T.email,'') = COALESCE(S.email,'') AND COALESCE(T.phone,'') = COALESCE(S.phone,''))
    WHEN MATCHED THEN UPDATE SET name=S.name, gdpr=S.gdpr, utm=S.utm, updated_at=S.ts
    WHEN NOT MATCHED THEN INSERT(name,email,phone,gdpr,utm,created_at) VALUES(S.name,S.email,S.phone,S.gdpr,S.utm,S.ts)
  `;
  const [job] = await client.createQueryJob({
    query,
    params: { name: lead.name, email: keyEmail, phone: keyPhone, gdpr: !!lead.gdpr, utm: lead.utm || null }
  });
  await job.getQueryResults();
}