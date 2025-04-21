"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="text-center py-20 text-red-500">
      <h2 className="text-2xl font-bold">Đã xảy ra lỗi!</h2>
      <p className="mt-4">{error.message}</p>
    </div>
  );
}