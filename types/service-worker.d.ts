declare module "*.ts" {
  const content: string;
  export default content;
}

declare const __WB_MANIFEST: Array<{
  url: string;
  revision: string | null;
}>;
