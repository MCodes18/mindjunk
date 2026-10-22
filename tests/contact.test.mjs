import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contactPayload } from '../src/lib/contact.js';

test('contact rejects whitespace-only, oversized and email-header injection input', () => {
  for (const form of [
    {from_email:'me@example.com',message:'   '},
    {from_email:'me@example.com\r\nBcc:someone@example.com',message:'Hello'},
    {from_email:'me@example.com',message:'x'.repeat(5001)},
    {from_email:'invalid',message:'Hello'}
  ]) assert.equal(contactPayload(form),null);
});
test('contact forwards only expected fields and treats markup as plain text', () => {
  assert.deepEqual(contactPayload({from_email:' me@example.com ',message:' <script>alert(1)</script> ',to_email:'attacker@example.com'}),
    {from_email:'me@example.com',message:'<script>alert(1)</script>'});
});
