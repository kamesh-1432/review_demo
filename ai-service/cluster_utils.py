from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import numpy as np

def dynamic_cluster_reviews(embeddings_list: list, reviews: list, min_k: int = 2, max_k: int = 5) -> tuple:
    """
    Dynamically groups reviews using KMeans. It calculates the Silhouette Score
    across multiple potential values of K to mathematically select the best number of clusters.
    """
    X = np.array(embeddings_list)
    total_samples = len(X)
    
    # Filter and noise reduction: Need at least 3 samples to compute clustering scores safely
    if total_samples < 3:
        return [0] * total_samples, 1
        
    best_k = min_k
    best_score = -1
    
    # Limit max K checks based on current sample availability
    upper_k_limit = min(max_k, total_samples - 1)
    
    if upper_k_limit <= min_k:
        kmeans = KMeans(n_clusters=min_k, random_state=42, n_init="auto")
        labels = kmeans.fit_predict(X)
        return labels.tolist(), min_k

    # Calculate optimal K using silhouette analysis
    for k in range(min_k, upper_k_limit + 1):
        kmeans = KMeans(n_clusters=k, random_state=42, n_init="auto")
        labels = kmeans.fit_predict(X)
        score = silhouette_score(X, labels)
        
        if score > best_score:
            best_score = score
            best_k = k
            
    # Run the final optimal K-Means cluster execution
    optimal_kmeans = KMeans(n_clusters=best_k, random_state=42, n_init="auto")
    optimal_labels = optimal_kmeans.fit_predict(X)
    
    return optimal_labels.tolist(), best_k